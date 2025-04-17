export const menuData = {
  menu_categories: [
    {
      "id": "appetizers",
      "name": "APPETIZERS",
      "items": [
        {
          "id": "papadum",
          "name": "Papadum",
          "description": "Thin crispy lentil crackers",
          "price": 3.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "pakoras",
          "name": "Pakoras",
          "description": "Mixed vegetable dipped into seasoned chickpea batter",
          "price": 5.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "samosa_2_pieces",
          "name": "Samosa (2 Pieces)",
          "description": "Spicy potato stuffed, seasoned chickpea batter",
          "price": 5.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        }
      ]
    },
    {
      "id": "vegetarian",
      "name": "VEGETARIAN",
      "items": [
        {
          "id": "aloo_palak",
          "name": "Aloo Palak",
          "description": "Potatoes cooked with spinach",
          "price": 12.99,
          "is_available": true,
          "dietary_options": ["Vegetarian,can be made vegan"]
        },
        {
          "id": "channa_masala",
          "name": "Channa Masala",
          "description": "Chickpeas cooked with a medley of spices",
          "price": 11.99,
          "is_available": true,
          "dietary_options": ["Vegetarian,can be made vegan"]
        },
        {
          "id": "daal_chana",
          "name": "Daal Chana",
          "description": "Lentils cooked with a medley of spices",
          "price": 11.99,
          "is_available": true,
          "dietary_options": ["Vegetarian,can be made vegan"]
        },
        {
          "id": "sabzi",
          "name": "Sabzi",
          "description": "Mix vegetable curry",
          "price": 12.99,
          "is_available": true,
          "dietary_options": ["Vegetarian,can be made vegan"]
        },
        {
          "id": "paneer_karahi",
          "name": "Paneer Karahi",
          "description": "Wok-fried paneer in traditional wok",
          "price": 12.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "began_Bharta",
          "name": "Began Bharta",
          "description": "Smoked eggplant cooked with onions",
          "price": 12.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "began_bharta_pakwan_style",
          "name": "Began Bharta Pakwan Style",
          "description": "Smoked eggplant cooked with onions and special creamy tomato sauce",
          "price": 12.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "paneer_tikka_masala",
          "name": "Paneer Tikka Masala",
          "description": "Chunk of cheese in creamy tomato sauce",
          "price": 14.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "saag_panner",
          "name": "Saag Panner",
          "description": "Chunks of cheese cooked with spinach and desi ghee",
          "price": 14.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "vegetable_korma",
          "name": "Vegetable Korma",
          "description": "Fresh vegetables cooked with a cream of tomato",
          "price": 13.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        }
      ]
    },
    {
      "id": "biryani",
      "name": "BIRYANI",
      "items": [
        {
          "id": "vegetable_biryani",
          "name": "Vegetable Biryani",
          "description": "Mixed vegetables cooked with basmati rice",
          "price": 14.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "chicken_biryani",
          "name": "Chicken Biryani",
          "description": "Chicken cooked with basmati rice",
          "price": 14.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "goat_biryani",
          "name": "Goat Biryani",
          "description": "Goat cooked with basmati rice",
          "price": 16.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "lamb_biryani",
          "name": "Lamb Biryani",
          "description": "Lamb cooked with basmati rice",
          "price": 16.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    },
    {
      "id": "chicken_specialties",
      "name": "CHICKEN SPECIALTIES",
      "items": [
        {
          "id": "karahi_chicken",
          "name": "Karahi Chicken",
          "description": "Wok fried boneless-chicken, served in traditional wok",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_achar",
          "name": "Chicken Achar",
          "description": "Boneless chicken cooked with roasted peppers",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_choley",
          "name": "Chicken Choley",
          "description": "Chicken cooked with garbanzo beans",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_saag",
          "name": "Chicken Saag",
          "description": "Chicken cooked with homemade spinach",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_tikka_masala",
          "name": "Chicken Tikka Masala",
          "description": "Boneless fillets marinated and cooked in a cream of tomato",
          "price": 15.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    },
    {
      "id": "meat_specialties",
      "name": "MEAT SPECIALTIES",
      "items": [
        {
          "id": "bhuna_ghost",
          "name": "Bhuna Ghost",
          "description": "Tender lamb curry, cooked with onions, tomato, mix of spices",
          "price": 15.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "achar_ghost",
          "name": "Achar Ghost",
          "description": "Tender lamb cooked with tomato, cooked with peppers",
          "price": 15.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "saag_ghost",
          "name": "Saag Ghost",
          "description": "Tender lamb cooked with homemade spinach",
          "price": 15.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "nihari_special",
          "name": "Nihari Special",
          "description": "Beef shank slowly stewed in a traditional spices",
          "price": 16.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "goat_karahi",
          "name": "Goat Karahi",
          "description": "Wok-fried (bone-in)goat, slow-cooked in a traditional wok",
          "price": 16.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    },
    {
      "id": "tandoori",
      "name": "TANDOORI (BBQ)",
      "items": [
        {
          "id": "beef_seekh_kabab",
          "name": "Beef Seekh Kabab",
          "description": "Ground beef mixed with fresh garlic and cilantro",
          "price": 4.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_seekh_kabab",
          "name": "Chicken Seekh Kabab",
          "description": "Ground chicken mixed with fresh garlic and herbs",
          "price": 4.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "tandoori_chicken_leg",
          "name": "Tandoori Chicken (leg)",
          "description": "Chicken leg marinated with yogurt and tandoori spices",
          "price": 6.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "boneless_chicken_boti",
          "name": "Boneless Chicken Boti",
          "description": "Juicy marinated chicken cubes, grilled in tandoor",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "beef_bihari_kabab",
          "name": "Beef Bihari Kabab",
          "description": "Juicy marinated beef slices, grilled in tandoor",
          "price": 13.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "lamb_chops",
          "name": "Lamb Chops",
          "description": "Juicy marinated lamb chops grilled in tandoor",
          "price": 14.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    },
    {
      "id": "wraps",
      "name": "WRAPS",
      "items": [
        {
          "id": "ctm_wrap",
          "name": "CTM Wrap",
          "description": "Chicken tikka masala in a naan, with onions and chutney",
          "price": 12.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "beef_seekh_kabob_wrap",
          "name": "Beef Seekh Kabob Wrap",
          "description": "Beef kabab, wrapped in naan, with onions and chutney",
          "price": 12.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_seekh_kabob_wrap",
          "name": "Chicken Seekh Kabob Wrap",
          "description": "Chicken kabab, wrapped in naan, with onions and chutney",
          "price": 12.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "paneer_wrap",
          "name": "Paneer Wrap",
          "description": "Paneer tikka masala in a naan with onions and chutney",
          "price": 12.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "pakora_wrap",
          "name": "Pakora Wrap",
          "description": "Mixed vegetable fritters in a naan with onions and chutney",
          "price": 10.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    },
    {
      "id": "sides",
      "name": "SIDES",
      "items": [
        {
          "id": "basmati_rice",
          "name": "Basmati Rice",
          "description": "Steamed rice with a hint of cumin",
          "price": 3.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "raita",
          "name": "Raita",
          "description": "Homemade yogurt mixed with cumin and cucumber",
          "price": 2.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        }
      ]
    },
    {
      "id": "desserts",
      "name": "DESSERTS",
      "items": [
        {
          "id": "kheer",
          "name": "Kheer",
          "description": "Rice pudding cooked with almond and coconut",
          "price": 4.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "gulab_jamun",
          "name": "Gulab Jamun",
          "description": "Sweet dough balls dipped in a sugary syrup",
          "price": 4.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        }
      ]
    },
    {
      "id": "naan",
      "name": "NAAN (PER PIECE)",
      "items": [
        {
          "id": "regular_naan",
          "name": "Regular Naan",
          "description": "Plain naan baked in tandoor",
          "price": 2.49,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "garlic_naan",
          "name": "Garlic Naan",
          "description": "Naan topped with fresh garlic and cilantro",
          "price": 3.49,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "onion_naan",
          "name": "Onion Naan",
          "description": "Naan stuffed with spiced onions  (1 piece)",
          "price": 4.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "potato_naan",
          "name": "Potato Naan",
          "description": "Naan stuffed with spiced potato  (1 piece)",
          "price": 4.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "chicken_qeeam_naan",
          "name": "Chicken Qeema Naan",
          "description": "Naan with minced chicken and spices",
          "price": 6.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "beeef_qeeam_naan",
          "name": "Beef Qeema Naan",
          "description": "Naan with minced beef and spices",
          "price": 6.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "cheese_naan",
          "name": "Cheese Naan",
          "description": "Naan stuffed with melted cheese",
          "price": 5.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "tandoori-roti",
          "name": "Tandoori Roti",
          "description": "Whole whesa bread",
          "price": 2.99,
          "is_available": true,
          "dietary_options": ["Vegetarian,can be made vegan"]
        }
      ]
    },
    {
      "id": "drinks",
      "name": "DRINKS",
      "items": [
        {
          "id": "mango_lassi",
          "name": "Mango Lassi",
          "description": "Refreshing yogurt drink with mango and milk",
          "price": 4.99,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "chai",
          "name": "Chai",
          "description": "Traditional South Asian hot & milk-included tea",
          "price": 2.00,
          "is_available": true,
          "dietary_options": ["Vegetarian"]
        },
        {
          "id": "soda",
          "name": "Soda",
          "description": "",
          "price": 2.99,
          "is_available": true,
          "dietary_options": []
        },
        {
          "id": "bottled_water",
          "name": "Bottled Water",
          "description": "",
          "price": 1.99,
          "is_available": true,
          "dietary_options": []
        }
      ]
    }
  ]
}; 