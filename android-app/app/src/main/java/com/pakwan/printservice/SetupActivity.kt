package com.pakwan.printservice

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.epson.epos2.Epos2Exception
import com.epson.epos2.printer.Printer
import com.google.firebase.firestore.FirebaseFirestore

class SetupActivity : AppCompatActivity() {
    private lateinit var locationIdInput: EditText
    private lateinit var saveButton: Button
    private lateinit var testPrintButton: Button
    private var printer: Printer? = null
    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setup)

        locationIdInput = findViewById(R.id.locationIdInput)
        saveButton = findViewById(R.id.saveButton)
        testPrintButton = findViewById(R.id.testPrintButton)

        // Load saved location ID
        val prefs = getSharedPreferences("PrinterConfig", MODE_PRIVATE)
        locationIdInput.setText(prefs.getString("locationId", ""))

        saveButton.setOnClickListener {
            val locationId = locationIdInput.text.toString()
            if (locationId.isNotEmpty()) {
                // Verify location exists
                db.collection("locations").document(locationId).get()
                    .addOnSuccessListener { document ->
                        if (document.exists()) {
                            // Save location ID
                            prefs.edit().putString("locationId", locationId).apply()
                            
                            // Start print service
                            startService(Intent(this, PrintService::class.java))
                            
                            Toast.makeText(this, "Setup complete!", Toast.LENGTH_SHORT).show()
                            finish()
                        } else {
                            Toast.makeText(this, "Invalid location ID", Toast.LENGTH_SHORT).show()
                        }
                    }
                    .addOnFailureListener {
                        Toast.makeText(this, "Error verifying location", Toast.LENGTH_SHORT).show()
                    }
            } else {
                Toast.makeText(this, "Please enter location ID", Toast.LENGTH_SHORT).show()
            }
        }

        testPrintButton.setOnClickListener {
            printTestReceipt()
        }
    }

    private fun printTestReceipt() {
        try {
            if (printer == null) {
                printer = Printer(Printer.TM_M30, Printer.MODEL_ANK, this)
            }

            printer?.beginTransaction()
            
            // Print test receipt
            printer?.addTextAlign(Printer.ALIGN_CENTER)
            printer?.addTextSize(2, 2)
            printer?.addText("PAKWAN\n")
            printer?.addTextSize(1, 1)
            printer?.addText("Test Print\n")
            printer?.addText("------------------------\n")
            printer?.addText("Location: ${locationIdInput.text}\n")
            printer?.addText("${java.util.Date()}\n")
            printer?.addText("\n")
            printer?.addText("If you can read this,\n")
            printer?.addText("your printer is working!\n")
            printer?.addText("\n")
            printer?.addCut(Printer.CUT_FEED)
            printer?.sendData(Printer.PARAM_DEFAULT)
            printer?.clearCommandBuffer()

            Toast.makeText(this, "Test print sent", Toast.LENGTH_SHORT).show()
        } catch (e: Epos2Exception) {
            Toast.makeText(this, "Print error: ${e.errorStatus}", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            printer?.clearCommandBuffer()
            printer?.disconnect()
        } catch (e: Epos2Exception) {
            // Handle error
        }
    }
} 