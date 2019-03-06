-- MySQL dump 10.13  Distrib 8.0.13, for macos10.14 (x86_64)
--
-- Host: localhost    Database: webshop
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `shopping_cart_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_items_products1_idx` (`product_id`),
  KEY `fk_cart_items_shopping_cart1_idx` (`shopping_cart_id`),
  CONSTRAINT `fk_cart_items_products1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_cart_items_shopping_cart1` FOREIGN KEY (`shopping_cart_id`) REFERENCES `shopping_cart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (117,3,6,1,'2019-03-06 03:06:07');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics'),(2,'Fashion'),(3,'Health & Beauty'),(4,'Motors'),(5,'Sports'),(6,'Home & Garden');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `invoice_date` datetime DEFAULT NULL,
  `invoice_desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_invoices_orders1_idx` (`order_id`),
  CONSTRAINT `fk_invoices_orders1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `date_sent` datetime DEFAULT NULL,
  `message_text` text,
  PRIMARY KEY (`id`),
  KEY `fk_messages_customers1_idx` (`customer_id`),
  CONSTRAINT `fk_messages_customers1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `order_item_status_code_id` int(11) NOT NULL,
  `order_item_quantity` int(11) DEFAULT NULL,
  `order_item_price` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_items_products1_idx` (`product_id`),
  KEY `fk_order_items_orders1_idx` (`order_id`),
  KEY `fk_order_items_order_items_status_codes1_idx` (`order_item_status_code_id`),
  CONSTRAINT `fk_order_items_order_items_status_codes1` FOREIGN KEY (`order_item_status_code_id`) REFERENCES `order_items_status_codes` (`id`),
  CONSTRAINT `fk_order_items_orders1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `fk_order_items_products1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items_status_codes`
--

DROP TABLE IF EXISTS `order_items_status_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_items_status_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_item_status_desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items_status_codes`
--

LOCK TABLES `order_items_status_codes` WRITE;
/*!40000 ALTER TABLE `order_items_status_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items_status_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_codes`
--

DROP TABLE IF EXISTS `order_status_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order_status_codes` (
  `order_status_code` int(11) NOT NULL AUTO_INCREMENT,
  `order_status_desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`order_status_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Cancelled, Completed\n';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_codes`
--

LOCK TABLES `order_status_codes` WRITE;
/*!40000 ALTER TABLE `order_status_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `order_status_code` int(11) NOT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orders_order_status_codes_idx` (`order_status_code`),
  KEY `fk_orders_customers1_idx` (`customer_id`),
  CONSTRAINT `fk_orders_customers1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_orders_order_status_codes` FOREIGN KEY (`order_status_code`) REFERENCES `order_status_codes` (`order_status_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` int(11) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_amount` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payments_invoices1_idx` (`invoice_id`),
  CONSTRAINT `fk_payments_invoices1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `sub_category_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `size` float DEFAULT NULL,
  `desc` text,
  `created_at` datetime DEFAULT NULL,
  `image` text,
  PRIMARY KEY (`id`),
  KEY `fk_products_categories1_idx` (`category_id`),
  KEY `fk_products_sub-categories1_idx` (`sub_category_id`),
  CONSTRAINT `fk_products_categories1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_products_sub-categories1` FOREIGN KEY (`sub_category_id`) REFERENCES `sub_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'Apple iPhone 7 Plus - 128GB',650,'Matte Black',15,'Apple iPhone 7 Plus 128GB, Brand new. Comes with original box and all accessories','2019-03-01 00:00:00','iphone7plus.png'),(2,1,2,'Apple Watch Series 4',320,'Rose Gold',5,'Introducing Apple Watch Series 4. Fundamentally redesigned and re-engineered to help you stay even more active, healthy, and connected.','2019-03-02 00:00:00','applewatch.png'),(3,1,4,'Microsoft Surface Pro 6',800,'Black',30,'Ultra-light and versatile. Get productive your way with new Surface Pro 6 — now faster than ever with the latest 8th Generation Intel® Core™ processor and the full Windows 10 Home experience.','2018-10-16 00:00:00','surfacepro6.png'),(4,1,4,'Apple Macbook Pro 15',2399,'Space Gray',35,'Touch Bar and Touch ID\n2.2GHz 6-Core Processor \n256GB Storage','2018-11-13 00:00:00','macbookpro152018.png'),(5,1,5,'Canon EOS 5d Mark III',445.88,'Black',12,'Canon is proud to present the highly anticipated EOS 5D Mark III. With supercharged EOS performance and stunning full frame, high-resolution image capture, the EOS 5D Mark III is designed to perform. Special optical technologies like the 61-Point High Density Reticular AF and an extended ISO range of 100–25600 expandable to 50 (L), 51200 (H1) and 102400 (H2) make the EOS 5D Mark III ideal for shooting weddings in the studio or out in the field, and great for still photography','2018-05-04 00:00:00','canon5dmark3.png'),(6,1,6,'Beats Pro',399.95,'Infinite Black',12,'From the first note to the final mix, the Beats Pro headphones deliver reliable studio-reference sound. A cushioned headband and heavily padded, rotating ear cups provide a comfortable fit for long hours.','2018-12-12 00:00:00','beatspro.png'),(7,1,6,'Beats Studio 3 Wireless',349.95,'White & Gold',12,'Up to 40-Hour Battery. Noise canceling headphones. Wireless.','2019-01-14 00:00:00','beatsstudio3.png'),(8,2,10,'Alpine Swiss Jake Means Pea Coat',185,'Black',35,'Winter coat','2018-12-25 00:00:00','coat.png'),(9,6,32,'DEWALT DCS355B 20V XR Oscillating Multi-Tool (Tool Only)',102.99,'Black and Yellow',32,'DEWALT Brushless Motor','2018-11-21 00:00:00','dewalt.png'),(10,3,16,'Maybelline Foundation Better Skin Superstay SPF',11.75,'Soft Tan',10,'Provides all day coverage and improves skin over time.','2018-10-13 00:00:00','maybellinefoundation.png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shipments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `shipment_tracking_number` int(11) DEFAULT NULL,
  `shipment_date` datetime DEFAULT NULL,
  `shipment_desc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shipments_invoices1_idx` (`invoice_id`),
  KEY `fk_shipments_orders1_idx` (`order_id`),
  CONSTRAINT `fk_shipments_invoices1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`),
  CONSTRAINT `fk_shipments_orders1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shopping_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shopping_cart_customers1_idx` (`customer_id`),
  CONSTRAINT `fk_shopping_cart_customers1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
INSERT INTO `shopping_cart` VALUES (6,9,'2019-03-06 02:49:08');
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_categories`
--

DROP TABLE IF EXISTS `sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `sub_category_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sub-categories_categories1_idx` (`category_id`),
  CONSTRAINT `fk_sub-categories_categories1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_categories`
--

LOCK TABLES `sub_categories` WRITE;
/*!40000 ALTER TABLE `sub_categories` DISABLE KEYS */;
INSERT INTO `sub_categories` VALUES (1,1,'Cell Phones & Accessories'),(2,1,'Smart Watches'),(3,1,'Video Games & Accessories'),(4,1,'Computers & Tablets'),(5,1,'Digital Cameras & Photo'),(6,1,'Headphones'),(7,1,'Computer Accessories'),(8,2,'Women\'s Clothing'),(9,2,'Women\'s Shoes'),(10,2,'Men\'s Clothing'),(11,2,'Men\'s Shoes'),(12,2,'Watches, Parts & Accessories'),(13,2,'Women\'s Handbags & Bags'),(14,2,'Men\'s Accessories'),(15,2,'Kids\' Clothing, Shoes & Accessories'),(16,3,'Makeup'),(17,3,'Health Care'),(18,3,'Nail Care, Manicure & Pedicure'),(19,3,'Hair Care & Styling'),(20,1,'TV & Audio'),(21,4,'Car & Truck Parts'),(22,4,'Motorcycle Parts'),(23,4,'ATV Parts'),(24,4,'Motorcycle Apparel'),(25,5,'Cycling'),(26,5,'Boxing & MMA Equipment'),(27,5,'Outdoor Sports'),(28,5,'Fishing Equipment & Supplies'),(29,5,'Fitness & Running Equipment'),(30,5,'Water Sports'),(31,5,'Team Sports'),(32,6,'Tools & Workshop Equipment'),(33,6,'Yard, Garden & Outdoor Living Items'),(34,6,'Home Improvement'),(35,6,'Kitchen, Dining & Bar Supplies'),(36,6,'Lamps, Lighting & Ceiling Fans'),(37,6,'Home Decor'),(38,6,'Pet Supplies');
/*!40000 ALTER TABLE `sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `date_of_birth` datetime DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `image` text,
  `address_1` varchar(255) DEFAULT NULL,
  `address_2` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  `confirmed` tinyint(4) DEFAULT NULL,
  `confirmed_on` datetime DEFAULT NULL,
  `password_reset` tinyint(4) DEFAULT NULL,
  `admin` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johndoe@webshop.com','john','1234','John','Doe','Male','1998-01-06 00:00:00','009132132142',NULL,'Manhattan 3 ',NULL,'New York','USA','1002',NULL,1,'2019-01-26 21:39:10',NULL,NULL),(2,'janemoe@webhshop.com','jane','12345','Jane','Moe','Female','1983-05-12 00:00:00','33923103215',NULL,'320-342 N Spring St','101-141 S Spring St','Los Angeles','USA','90012',NULL,NULL,NULL,NULL,NULL),(9,'noisewavehd@gmail.com','omke','sha256$D0SPbYdt$f2e6ae9c6cf74ff1edb6fa7968fe30f01c1307ad2c76441b71c392c247e30b7a','Omar','Iriskic','male','1998-03-01 00:00:00','642239164','viber image.jpg','Žitni Trg 9, 44','Jovana Raskovica 19','Novi Sad','RS','21000','2019-03-06 02:46:54',1,'2019-03-06 02:49:29',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-06  3:12:06
