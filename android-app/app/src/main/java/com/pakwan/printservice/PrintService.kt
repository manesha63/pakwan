package com.pakwan.printservice

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ListenerRegistration
import com.epson.epos2.Epos2Exception
import com.epson.epos2.printer.Printer
import com.epson.epos2.printer.PrinterStatusInfo
import com.epson.epos2.printer.ReceiveListener

class PrintService : Service() {
    private var printer: Printer? = null
    private var orderListener: ListenerRegistration? = null
    private val db = FirebaseFirestore.getInstance()
    private val TAG = "PrintService"

    override fun onCreate() {
        super.onCreate()
        initializePrinter()
        startListeningForOrders()
    }

    private fun initializePrinter() {
        try {
            printer = Printer(Printer.TM_M30, Printer.MODEL_ANK, this)
            printer?.setReceiveEventListener(object : ReceiveListener {
                override fun onPtrReceive(printer: Printer?, code: Int, status: PrinterStatusInfo?, printJobId: String?) {
                    // Handle print completion
                    Log.d(TAG, "Print job completed: $code")
                }
            })
        } catch (e: Epos2Exception) {
            Log.e(TAG, "Printer initialization error: ${e.errorStatus}")
        }
    }

    private fun startListeningForOrders() {
        // Get location ID from shared preferences
        val locationId = getSharedPreferences("PrinterConfig", MODE_PRIVATE)
            .getString("locationId", null) ?: return

        orderListener = db.collection("orders")
            .whereEqualTo("locationId", locationId)
            .whereEqualTo("status", "pending")
            .addSnapshotListener { snapshots, error ->
                if (error != null) {
                    Log.e(TAG, "Listen failed: $error")
                    return@addSnapshotListener
                }

                snapshots?.documentChanges?.forEach { change ->
                    if (change.type == DocumentChange.Type.ADDED) {
                        val order = change.document.toObject(Order::class.java)
                        printOrder(order)
                    }
                }
            }
    }

    private fun printOrder(order: Order) {
        try {
            printer?.beginTransaction()
            
            // Print header
            printer?.addTextAlign(Printer.ALIGN_CENTER)
            printer?.addTextSize(2, 2)
            printer?.addText("PAKWAN\n")
            printer?.addTextSize(1, 1)
            printer?.addText("Order #${order.id}\n")
            printer?.addText("${order.timestamp}\n")
            printer?.addText("------------------------\n")

            // Print items
            printer?.addTextAlign(Printer.ALIGN_LEFT)
            order.items.forEach { item ->
                printer?.addText("${item.quantity}x ${item.name}\n")
                printer?.addText("    $${item.price}\n")
            }

            // Print totals
            printer?.addText("------------------------\n")
            printer?.addText("Subtotal: $${order.subtotal}\n")
            printer?.addText("Tax: $${order.tax}\n")
            printer?.addText("Total: $${order.total}\n")
            printer?.addText("\n")

            // Print customer info
            printer?.addText("Customer: ${order.customerName}\n")
            printer?.addText("Phone: ${order.customerPhone}\n")
            if (order.deliveryAddress != null) {
                printer?.addText("Delivery Address:\n")
                printer?.addText(order.deliveryAddress)
            }

            printer?.addCut(Printer.CUT_FEED)
            printer?.sendData(Printer.PARAM_DEFAULT)
            printer?.clearCommandBuffer()
        } catch (e: Epos2Exception) {
            Log.e(TAG, "Print error: ${e.errorStatus}")
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        orderListener?.remove()
        try {
            printer?.clearCommandBuffer()
            printer?.disconnect()
        } catch (e: Epos2Exception) {
            Log.e(TAG, "Printer disconnect error: ${e.errorStatus}")
        }
    }
} 