-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fruitshop
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `cart_id` bigint NOT NULL,
  `fruit_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcttvuq4mxppo8sxggjtn5i2c` (`cart_id`),
  KEY `FKqhephi63j78ewqlpsxa1o9dtx` (`fruit_id`),
  CONSTRAINT `FKpcttvuq4mxppo8sxggjtn5i2c` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `FKqhephi63j78ewqlpsxa1o9dtx` FOREIGN KEY (`fruit_id`) REFERENCES `fruits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK64t7ox312pqal3p7fg9o503c2` (`user_id`),
  CONSTRAINT `FKb5o626f86h46m4s7ms6ginnop` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,12),(2,13);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Táo có vị ngọt thanh, giàu chất xơ và vitamin C, hỗ trợ tiêu hóa và sức khỏe tim mạch. Thích hợp ăn trực tiếp, làm nước ép, hoặc dùng trong bánh và salad.','Táo'),(2,'Chuối cung cấp kali, vitamin B6, và năng lượng nhanh, lý tưởng cho bữa sáng hoặc sau khi tập luyện. Có thể ăn tươi, làm sinh tố, hoặc nướng bánh chuối.','Chuối'),(3,'Xoài ngọt ngào, giàu vitamin A và C, tốt cho mắt và hệ miễn dịch. Thường được ăn tươi, làm sinh tố, hoặc dùng trong các món salad và nước chấm.','Xoài'),(4,'Cam chứa nhiều vitamin C, tăng cường miễn dịch và cải thiện làn da. Phổ biến trong nước ép, salad, hoặc ăn trực tiếp để giải nhiệt.','Cam'),(5,'Dứa có vị ngọt chua, giàu enzyme bromelain hỗ trợ tiêu hóa. Dùng trong món tráng miệng, sinh tố, hoặc làm nước ép và món xào.','Dứa'),(6,'Dưa hấu mọng nước, chứa lycopene và vitamin A, giúp giải nhiệt và bảo vệ tim mạch. Thích hợp ăn tươi, làm nước ép, hoặc dùng trong salad trái cây.','Dưa hấu'),(7,'Nho giàu chất chống oxy hóa như resveratrol, tốt cho tim và chống lão hóa. Có thể ăn tươi, làm nước ép, hoặc dùng trong món tráng miệng và salad.','Nho'),(8,'Bưởi chứa vitamin C và chất xơ, hỗ trợ giảm cân và tăng cường miễn dịch. Thường được ăn tươi, làm nước ép, hoặc dùng trong các món gỏi.','Bưởi'),(9,'Dâu tây ngọt nhẹ, giàu vitamin C và chất chống oxy hóa, tốt cho da và sức khỏe tổng thể. Dùng trong sinh tố, bánh ngọt, hoặc ăn tươi với kem.','Dâu tây'),(10,'Thanh long có vị ngọt dịu, chứa chất xơ và vitamin C, hỗ trợ tiêu hóa và làm đẹp da. Thích hợp ăn tươi, làm sinh tố, hoặc dùng trong salad trái cây.','Thanh long'),(16,'Ngọt','Dưa gang');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fruit_categories`
--

DROP TABLE IF EXISTS `fruit_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fruit_categories` (
  `fruit_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  KEY `FKlt3u7ro5047gx8nngrh5gaoqu` (`category_id`),
  KEY `FKqps5ujawdg53ohrlto5j7rm3p` (`fruit_id`),
  CONSTRAINT `FKlt3u7ro5047gx8nngrh5gaoqu` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `FKqps5ujawdg53ohrlto5j7rm3p` FOREIGN KEY (`fruit_id`) REFERENCES `fruits` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fruit_categories`
--

LOCK TABLES `fruit_categories` WRITE;
/*!40000 ALTER TABLE `fruit_categories` DISABLE KEYS */;
INSERT INTO `fruit_categories` VALUES (36,1),(37,2),(38,3),(39,4),(40,5),(41,6),(42,7),(43,8),(44,9),(45,10);
/*!40000 ALTER TABLE `fruit_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fruits`
--

DROP TABLE IF EXISTS `fruits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fruits` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `tags` text,
  `average_rating` double DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `import_date` date DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `stock_status` enum('IN_STOCK','LOW_STOCK','OUT_OF_STOCK') DEFAULT NULL,
  `weight` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fruits`
--

LOCK TABLES `fruits` WRITE;
/*!40000 ALTER TABLE `fruits` DISABLE KEYS */;
INSERT INTO `fruits` VALUES (36,'Táo Fuji nhập khẩu từ Mỹ, giòn rụm, ngọt thanh, giàu chất xơ và vitamin C. Táo hỗ trợ tiêu hóa, giảm cholesterol và tốt cho tim mạch. Thích hợp ăn trực tiếp, làm nước ép, hoặc dùng trong salad và bánh táo. Được chọn lọc từ các nông trại đạt chuẩn, đảm bảo tươi ngon và an toàn.','/images/1b0f8fed-d66f-41a1-8856-c27f077ebaea_mua-tao-my-huu-co-o-dau (1).jpg','Táo',45000,120,'ngọt,vitamin C,giải nhiệt',0,0.1,'2025-05-01','Mỹ','IN_STOCK',0.2),(37,'Chuối chín vàng từ Tiền Giang, Việt Nam, ngọt tự nhiên, giàu kali và vitamin B6. Chuối cung cấp năng lượng nhanh, hỗ trợ tiêu hóa và cải thiện tâm trạng. Lý tưởng cho sinh tố, bánh chuối, hoặc ăn sáng. Được thu hoạch từ nông trại VietGAP, đảm bảo chất lượng cao.','/images/d10079d7-e9f5-41ff-b98b-e0cacdf36767_base64-1735060409070433317086.png','Chuối',25000,200,'ngọt,kali,năng lượng',0,0,'2025-05-02','Việt Nam','IN_STOCK',0.15),(38,'Xoài cát Hòa Lộc nhập khẩu từ Thái Lan, thịt quả mọng, ngọt đậm, giàu vitamin A và C. Xoài giúp tăng cường miễn dịch, làm đẹp da và hỗ trợ tiêu hóa. Thích hợp ăn tươi, làm sinh tố, hoặc salad. Nhập khẩu trực tiếp, đảm bảo độ tươi và chất lượng.','/images/b95a7974-ad95-468c-960f-b9be56617b52_xoai.png','Xoài',60000,90,'ngọt,vitamin C,nhiệt đới',0,0.15,'2025-05-03','Thái Lan','LOW_STOCK',0.4),(39,'Cam sành Cao Phong, Việt Nam, mọng nước, vị ngọt chua cân bằng, giàu vitamin C. Cam tăng cường miễn dịch, cải thiện làn da và giải nhiệt. Thích hợp làm nước ép, salad, hoặc ăn trực tiếp. Được thu hoạch từ vườn VietGAP, đảm bảo an toàn thực phẩm.','/images/5ed79054-94d1-4887-939a-af2979882b95_unnamed.png','Cam',35000,150,'chua ngọt,vitamin C,giải nhiệt',0,0.05,'2025-05-04','Việt Nam','IN_STOCK',0.25),(40,'Dứa Queen từ Lâm Đồng, Việt Nam, vị ngọt chua, giàu enzyme bromelain hỗ trợ tiêu hóa. Dứa dùng trong sinh tố, món tráng miệng, hoặc xào với thịt. Được chọn lọc kỹ, đảm bảo quả chín đều, thơm ngon. Lý tưởng cho các món ăn mùa hè.','/images/c09f90b5-f0d5-4afe-a0ec-8cf352809f40_dua.png','Dứa',30000,100,'ngọt chua,tiêu hóa,giải nhiệt',0,0,'2025-05-05','Việt Nam','IN_STOCK',1),(41,'Dưa hấu Long An, Việt Nam, mọng nước, vị ngọt nhẹ, chứa lycopene và vitamin A. Dưa hấu giúp giải nhiệt, bảo vệ tim mạch và hỗ trợ hydrat hóa. Thích hợp ăn tươi, làm nước ép, hoặc salad trái cây. Được thu hoạch từ nông trại uy tín.','/images/8a79f0bf-b097-4a41-b159-924ca74a7341_dua-hau.png','Dưa hấu',20000,250,'ngọt,giải nhiệt,vitamin A',0,0,'2025-05-06','Việt Nam','IN_STOCK',2),(42,'Nho mẫu đơn nhập khẩu từ Úc, ngọt đậm, giàu resveratrol tốt cho tim và chống lão hóa. Nho dùng ăn tươi, làm nước ép, hoặc trang trí món tráng miệng. Được nhập khẩu trực tiếp, đảm bảo quả mọng, tươi ngon. Lý tưởng cho các bữa tiệc.','/images/ab27bc80-396c-4580-a9f1-bd3b9d639513_nhomy.png','Nho',80000,60,'ngọt,anti-aging,vitamin C',0,0.16,'2025-05-07','Úc','LOW_STOCK',0.01),(43,'Bưởi da xanh Tiền Giang, Việt Nam, múi mọng, vị ngọt thanh, giàu vitamin C và chất xơ. Bưởi hỗ trợ giảm cân, tăng cường miễn dịch và làm đẹp da. Thích hợp ăn tươi, làm gỏi, hoặc nước ép. Được thu hoạch từ vườn đạt chuẩn.','/images/59bbac9d-08fe-4a2b-9500-23612b5f8160_buoi.png','Bưởi',40000,80,'ngọt,vitamin C,giảm cân',0,0.1,'2025-05-08','Việt Nam','IN_STOCK',1.5),(44,'Dâu tây Đà Lạt, Việt Nam, ngọt nhẹ, giàu vitamin C và chất chống oxy hóa. Dâu tây tốt cho da và sức khỏe tổng thể, dùng trong sinh tố, bánh ngọt, hoặc ăn với kem. Được thu hoạch thủ công, đảm bảo quả tươi, không dập.','/images/58e0fbc0-b0df-463a-a340-f3fa2e75e3df_dau-tay.png','Dâu tây',120000,50,'ngọt,vitamin C,làm đẹp',0,0,'2025-05-09','Việt Nam','LOW_STOCK',0.02),(45,'Thanh long Bình Thuận, Việt Nam, vị ngọt dịu, chứa chất xơ và vitamin C. Thanh long hỗ trợ tiêu hóa, làm đẹp da và giảm cholesterol. Thích hợp ăn tươi, làm sinh tố, hoặc salad trái cây. Được thu hoạch từ nông trại chất lượng cao.','/images/036166a1-ff01-4414-8366-2cec5a759b1b_thanh-long-7.png','Thanh long',30000,130,'ngọt,vitamin C,tiêu hóa',0,0,'2025-05-10','Việt Nam','IN_STOCK',0.5);
/*!40000 ALTER TABLE `fruits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  `content` text,
  `date` date DEFAULT NULL,
  `excerpt` text,
  `image` varchar(255) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKowrieak0v8dvhynft9mxexw15` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (7,'Mẹo vặt','Cải xanh (broccoli) là một trong những loại rau củ giàu dinh dưỡng nhất, được mệnh danh là \"siêu thực phẩm\". Với hàm lượng vitamin C, K, và chất xơ cao, cải xanh giúp tăng cường hệ miễn dịch, hỗ trợ tiêu hóa và giảm nguy cơ mắc bệnh tim mạch. Ngoài ra, chất sulforaphane trong cải xanh có khả năng chống oxy hóa mạnh mẽ, giúp ngăn ngừa ung thư. Một khẩu phần 100g cải xanh cung cấp tới 89mg vitamin C, vượt xa nhu cầu hàng ngày của người lớn. Cải xanh cũng chứa canxi và sắt, phù hợp cho những người ăn chay hoặc cần bổ sung khoáng chất.\r\n\r\nCách chế biến cải xanh rất đa dạng: luộc, hấp, xào, hoặc thêm vào các món súp và salad. Để giữ được tối đa dinh dưỡng, bạn nên hấp nhẹ trong 5-7 phút thay vì luộc quá lâu. Một mẹo nhỏ là kết hợp cải xanh với dầu ô liu hoặc chanh để tăng khả năng hấp thụ chất dinh dưỡng. Khi mua, hãy chọn những bông cải xanh có màu xanh đậm, không bị vàng úa, và bảo quản trong tủ lạnh trong túi kín để giữ tươi lâu hơn. Bạn cũng có thể làm sinh tố cải xanh kết hợp với táo và gừng để có một thức uống lành mạnh, giàu năng lượng.\r\n\r\nCải xanh không chỉ tốt cho sức khỏe mà còn dễ dàng kết hợp vào các bữa ăn hàng ngày. Hãy thử làm món cải xanh xào tỏi hoặc cải xanh nướng với phô mai để thay đổi khẩu vị. Với giá trị dinh dưỡng vượt trội và tính linh hoạt trong chế biến, cải xanh xứng đáng là một phần không thể thiếu trong chế độ ăn uống của bạn.',NULL,'Cải xanh – siêu thực phẩm giàu vitamin và chất xơ, giúp tăng cường sức khỏe và ngăn ngừa bệnh tật.','http://localhost:8080/images/8209cea4-09ce-4740-aa8d-cb662129358e_cai-xanh.png','cai-xanh-sieu-thuc-pham','Cải Xanh: Siêu Thực Phẩm Cho Sức Khỏe'),(8,'Mẹo vặt','Cà rốt là loại củ quen thuộc với màu cam rực rỡ, nổi tiếng nhờ hàm lượng beta-carotene cao, một chất chống oxy hóa chuyển hóa thành vitamin A trong cơ thể. Vitamin A không chỉ tốt cho thị lực mà còn hỗ trợ làn da khỏe mạnh và tăng cường hệ miễn dịch. Một củ cà rốt trung bình (khoảng 60g) cung cấp hơn 200% nhu cầu vitamin A hàng ngày, cùng với vitamin K, C, và kali. Ngoài ra, chất xơ trong cà rốt giúp cải thiện tiêu hóa và giảm cholesterol.\r\n\r\nCà rốt có thể được chế biến thành nhiều món ngon, từ salad, súp, đến nước ép. Nước ép cà rốt kết hợp với cam hoặc gừng là thức uống giải nhiệt tuyệt vời, đặc biệt vào mùa hè. Bạn cũng có thể nướng cà rốt với mật ong và thảo mộc để tạo món ăn kèm hấp dẫn. Khi chế biến, tránh gọt vỏ quá dày vì lớp vỏ ngoài chứa nhiều chất dinh dưỡng. Để bảo quản, hãy giữ cà rốt trong túi kín ở ngăn mát tủ lạnh, tránh để gần táo hoặc lê vì chúng tiết ra khí ethylene khiến cà rốt đắng.\r\n\r\nCà rốt không chỉ là thực phẩm bổ dưỡng mà còn là nguyên liệu linh hoạt trong nhà bếp. Hãy thử làm bánh cà rốt với kem phô mai hoặc cà rốt xào bơ để khám phá hương vị mới. Với giá thành phải chăng và lợi ích sức khỏe vượt trội, cà rốt là lựa chọn lý tưởng cho mọi gia đình.',NULL,'Cà rốt giàu vitamin A, tốt cho mắt và da, là nguyên liệu không thể thiếu trong bếp.','f4975d54-3b99-485a-8dcc-115573b40ea6_carot.png','ca-rot-vitamin-a','Cà Rốt: Bí Quyết Cho Đôi Mắt Sáng'),(9,'Mẹo vặt','Rau chân vịt (spinach) là loại rau lá xanh đậm, được yêu thích trong các chế độ ăn lành mạnh nhờ hàm lượng dinh dưỡng ấn tượng. Rau chân vịt chứa nhiều sắt, canxi, và vitamin K, giúp hỗ trợ sức khỏe xương và ngăn ngừa thiếu máu. Một chén rau chân vịt nấu chín (180g) cung cấp khoảng 5mg sắt, đáp ứng gần 30% nhu cầu hàng ngày của người lớn. Ngoài ra, chất chống oxy hóa như lutein và zeaxanthin trong rau chân vịt bảo vệ mắt khỏi tác hại của ánh sáng xanh.\r\n\r\nRau chân vịt có thể được dùng sống trong salad, nấu chín trong súp, hoặc làm sinh tố. Để giữ được dinh dưỡng, bạn nên nấu nhẹ hoặc dùng sống thay vì đun quá lâu. Một món ăn đơn giản là rau chân vịt xào tỏi, chỉ cần 5 phút là có ngay món ngon giàu dinh dưỡng. Khi mua, chọn lá rau chân vịt tươi, xanh đậm, không bị héo, và bảo quản trong túi kín ở tủ lạnh trong vòng 5-7 ngày. Nếu muốn lưu trữ lâu hơn, bạn có thể đông lạnh rau chân vịt sau khi chần sơ.\r\n\r\nRau chân vịt là lựa chọn lý tưởng cho người ăn chay hoặc những ai muốn giảm cân nhờ hàm lượng calo thấp nhưng giàu dinh dưỡng. Hãy thử làm món smoothie rau chân vịt với chuối và bơ để khởi đầu ngày mới tràn năng lượng. Với tính linh hoạt và lợi ích sức khỏe, rau chân vịt là thực phẩm không thể bỏ qua.',NULL,'Rau chân vịt giàu sắt và canxi, là lựa chọn hoàn hảo cho chế độ ăn lành mạnh.','47d7287a-0df7-4968-a4d8-7c609203f640_rau-chan-vit-1.png','rau-chan-vit-dinh-duong','Rau Chân Vịt: Thực Phẩm Xanh Cho Người Ăn Chay'),(10,'Sản phẩm mới','Cá hồi là một trong những loại cá giàu dinh dưỡng nhất, đặc biệt nổi tiếng với hàm lượng omega-3 cao, tốt cho tim mạch và não bộ. Một khẩu phần cá hồi 100g cung cấp khoảng 2.3g omega-3, cùng với protein chất lượng cao, vitamin D, và selen. Omega-3 giúp giảm viêm, cải thiện cholesterol, và hỗ trợ sức khỏe tinh thần. Cá hồi cũng chứa astaxanthin, một chất chống oxy hóa giúp bảo vệ tế bào khỏi tổn thương.\r\n\r\nCá hồi có thể được chế biến theo nhiều cách: nướng, áp chảo, hoặc làm sashimi. Một món ăn đơn giản là cá hồi nướng với chanh, mật ong, và thảo mộc, giữ được vị ngọt tự nhiên của cá. Khi mua, chọn cá hồi có màu cam hồng tươi, không có mùi tanh nồng, và bảo quản trong tủ lạnh tối đa 2 ngày hoặc đông lạnh nếu không dùng ngay. Để tăng hương vị, bạn có thể ướp cá hồi với nước tương và gừng trước khi chế biến.\r\n\r\nCá hồi không chỉ ngon mà còn là thực phẩm lý tưởng cho những ai muốn duy trì sức khỏe lâu dài. Hãy thử làm salad cá hồi với bơ và rau xanh hoặc cá hồi áp chảo với sốt bơ tỏi để thay đổi thực đơn. Với giá trị dinh dưỡng vượt trội, cá hồi xứng đáng là ngôi sao trong các bữa ăn gia đình.',NULL,'Cá hồi giàu omega-3, tốt cho tim và não, là lựa chọn tuyệt vời cho bữa ăn.','0ef2c073-12bf-4461-b921-86452e5233fb_cahoi.png','ca-hoi-omega-3','Cá Hồi: Nguồn Omega-3 Dồi Dào'),(11,'Tin tức','Ức gà là nguồn protein ít béo hàng đầu, được ưa chuộng bởi những người tập luyện thể thao và muốn duy trì vóc dáng. Một miếng ức gà 100g cung cấp khoảng 31g protein, chỉ 3g chất béo, và hầu như không chứa carbohydrate. Ức gà cũng giàu vitamin B6 và niacin, hỗ trợ chuyển hóa năng lượng và sức khỏe thần kinh. Với hàm lượng calo thấp, ức gà là lựa chọn lý tưởng cho chế độ ăn kiêng.\r\n\r\nỨc gà có thể được chế biến đa dạng: nướng, áp chảo, luộc, hoặc thêm vào các món salad và wrap. Để tránh khô, bạn nên ướp ức gà với dầu ô liu, nước cốt chanh, và gia vị ít nhất 30 phút trước khi nấu. Một món ăn phổ biến là ức gà nướng với thảo mộc và sốt yogurt, vừa ngon miệng vừa lành mạnh. Khi bảo quản, giữ ức gà trong tủ lạnh trong vòng 1-2 ngày hoặc đông lạnh để dùng lâu dài.\r\n\r\nỨc gà không chỉ bổ dưỡng mà còn dễ dàng kết hợp vào các bữa ăn hàng ngày. Hãy thử làm món ức gà nhồi phô mai và rau chân vịt hoặc ức gà xé phay trộn salad để đổi vị. Với tính linh hoạt và giá trị dinh dưỡng, ức gà là thực phẩm không thể thiếu trong bếp.',NULL,'Ức gà giàu protein, ít béo, là thực phẩm lý tưởng cho người tập luyện.','fc76f775-3b29-4df1-b78b-4df6f657c5ee_ucga.png','uc-ga-protein','Ức Gà: Thực Phẩm Cho Cơ Bắp'),(12,'Tin tức','Cá ngừ là nguồn protein chất lượng cao, được yêu thích nhờ sự tiện lợi và giá trị dinh dưỡng. Một khẩu phần cá ngừ đóng hộp 100g cung cấp khoảng 25g protein, vitamin D, và selen, hỗ trợ sức khỏe cơ bắp và hệ miễn dịch. Cá ngừ cũng chứa omega-3, dù ít hơn cá hồi, giúp giảm nguy cơ bệnh tim. Loại cá này đặc biệt phù hợp cho những người bận rộn nhờ thời gian chế biến nhanh.\r\n\r\nCá ngừ có thể được dùng trong sandwich, salad, hoặc các món pasta. Một món ăn đơn giản là salad cá ngừ với đậu, hành tây, và sốt mayonnaise, chỉ mất 10 phút để chuẩn bị. Khi chọn cá ngừ đóng hộp, hãy ưu tiên loại ngâm trong nước thay vì dầu để giảm calo. Nếu dùng cá ngừ tươi, hãy nướng hoặc áp chảo để giữ được hương vị. Bảo quản cá ngừ tươi trong tủ lạnh tối đa 1 ngày hoặc đông lạnh nếu cần.\r\n\r\nCá ngừ là lựa chọn tuyệt vời cho bữa ăn nhanh nhưng vẫn đảm bảo dinh dưỡng. Hãy thử làm bánh mì cá ngừ với rau diếp và cà chua hoặc cá ngừ nướng với sốt teriyaki để thay đổi thực đơn. Với tính tiện lợi và lợi ích sức khỏe, cá ngừ là thực phẩm đáng để thử.',NULL,'Cá ngừ giàu protein, tiện lợi, là lựa chọn hoàn hảo cho bữa ăn nhanh.','ab3f9528-f7b9-4574-a6b2-45e67b9babe1_cangu.png','ca-ngu-tien-loi','Cá Ngừ: Thực Phẩm Tiện Lợi Và Bổ Dưỡng'),(13,'Sản phẩm mới','Thịt bò là nguồn protein và khoáng chất dồi dào, đặc biệt giàu sắt và kẽm, hỗ trợ tạo máu và tăng cường miễn dịch. Một khẩu phần thịt bò nạc 100g cung cấp khoảng 27g protein, 3mg sắt, và 5mg kẽm, đáp ứng một phần lớn nhu cầu hàng ngày. Thịt bò cũng chứa vitamin B12, cần thiết cho sức khỏe thần kinh. Chọn thịt bò hữu cơ hoặc thịt bò nuôi cỏ để đảm bảo chất lượng và giảm thiểu chất phụ gia.\r\n\r\nThịt bò có thể được chế biến thành steak, bò xào, hoặc các món hầm. Một món ăn được yêu thích là steak bò nướng vừa (medium-rare) với muối biển và tiêu đen, giữ được độ mềm và vị ngọt tự nhiên. Để thịt bò mềm hơn, bạn có thể ướp với nước ép dứa hoặc để thịt ở nhiệt độ phòng trước khi nấu. Bảo quản thịt bò trong tủ lạnh tối đa 3 ngày hoặc đông lạnh trong vòng 6 tháng.\r\n\r\nThịt bò không chỉ ngon mà còn mang lại giá trị dinh dưỡng cao cho bữa ăn. Hãy thử làm bò xào hành tây hoặc thịt bò hầm khoai tây để làm phong phú thực đơn gia đình. Với chất lượng vượt trội, thịt bò là lựa chọn hoàn hảo cho những dịp đặc biệt.',NULL,'Thịt bò giàu sắt và kẽm, là nguyên liệu cao cấp cho bữa ăn thịnh soạn.','319cbefc-ec82-416b-b104-e450cfb1706a_chung-nhan-bo-huu-co-1.png','thit-bo-huu-co','Thịt Bò Hữu Cơ: Lựa Chọn Cao Cấp'),(14,'Trái cây','Táo là loại trái cây phổ biến, được yêu thích nhờ hương vị ngọt thanh và giá trị dinh dưỡng cao. Một quả táo trung bình (182g) cung cấp khoảng 4g chất xơ, 14% nhu cầu vitamin C hàng ngày, và các chất chống oxy hóa như quercetin, giúp giảm viêm và bảo vệ tim mạch. Chất xơ trong táo hỗ trợ tiêu hóa, giảm cholesterol, và giúp kiểm soát lượng đường trong máu, phù hợp cho người tiểu đường.\r\n\r\nTáo có thể ăn trực tiếp, làm salad, hoặc dùng trong các món bánh như bánh táo. Một món ăn sáng lành mạnh là táo cắt lát với bơ đậu phộng và granola, cung cấp năng lượng bền vững. Khi chọn táo, hãy ưu tiên quả có vỏ bóng, không bị dập, và bảo quản trong ngăn mát tủ lạnh để giữ tươi trong 1-2 tháng. Để tránh táo bị thâm sau khi cắt, ngâm táo trong nước pha chút chanh.\r\n\r\nTáo không chỉ là món ăn vặt tiện lợi mà còn là nguyên liệu đa năng trong nhà bếp. Hãy thử làm nước ép táo với gừng hoặc táo nướng với quế để khám phá hương vị mới. Với lợi ích sức khỏe và tính linh hoạt, táo là trái cây không thể thiếu trong chế độ ăn uống.','2025-05-15','Táo giàu chất xơ và vitamin C, là trái cây lý tưởng cho sức khỏe tim mạch.','apple_thumb.jpg','tao-suc-khoe-tim','Táo: Trái Cây Cho Trái Tim Khỏe'),(15,'Tin tức','Chuối là nguồn năng lượng tự nhiên, được yêu thích nhờ vị ngọt và tiện lợi. Một quả chuối trung bình (120g) cung cấp khoảng 400mg kali, 3g chất xơ, và vitamin B6, giúp điều hòa huyết áp, hỗ trợ tiêu hóa, và cải thiện tâm trạng. Chuối cũng chứa carbohydrate dễ tiêu hóa, cung cấp năng lượng tức thì, lý tưởng cho bữa sáng hoặc sau khi tập luyện.\r\n\r\nChuối có thể ăn trực tiếp, làm sinh tố, hoặc dùng trong bánh mì chuối. Một món ăn sáng phổ biến là sinh tố chuối với sữa hạnh nhân và yến mạch, vừa ngon vừa no lâu. Khi mua, chọn chuối có vỏ vàng, không quá chín, và bảo quản ở nhiệt độ phòng, tránh để gần các loại trái cây khác để ngăn chuối chín quá nhanh. Nếu muốn lưu trữ lâu, bạn có thể đông lạnh chuối để làm kem hoặc sinh tố.\r\n\r\nChuối là lựa chọn tuyệt vời cho những ai muốn bổ sung năng lượng một cách tự nhiên. Hãy thử làm bánh chuối nướng hoặc chuối chiên với mật ong để đổi vị. Với giá thành phải chăng và lợi ích sức khỏe, chuối là trái cây không thể bỏ qua.',NULL,'Chuối cung cấp kali và năng lượng, là lựa chọn lý tưởng cho bữa sáng.','d9a6f343-5ee2-438e-8d61-09d1f97eb2ba_chuoi.png','chuoi-nang-luong','Chuối: Năng Lượng Tự Nhiên'),(16,'Trái cây','Xoài là loại trái cây nhiệt đới ngọt ngào, được yêu thích nhờ hương vị độc đáo và giá trị dinh dưỡng. Một quả xoài (200g) cung cấp khoảng 60mg vitamin C, 25% nhu cầu vitamin A hàng ngày, và các chất chống oxy hóa như mangiferin, giúp bảo vệ cơ thể khỏi stress oxy hóa. Xoài cũng chứa chất xơ và enzyme tiêu hóa, hỗ trợ sức khỏe đường ruột và giảm táo bón.\r\n\r\nXoài có thể ăn trực tiếp, làm sinh tố, hoặc dùng trong các món salad và nước chấm. Một món ăn hấp dẫn là salad xoài với tôm và rau mùi, mang đến hương vị tươi mát. Khi chọn xoài, hãy tìm quả có vỏ căng, hơi mềm khi bóp nhẹ, và bảo quản ở nhiệt độ phòng cho đến khi chín, sau đó chuyển vào tủ lạnh. Để giữ xoài tươi lâu, bạn có thể cắt nhỏ và đông lạnh.\r\n\r\nXoài không chỉ ngon mà còn là nguồn dinh dưỡng tuyệt vời cho mọi lứa tuổi. Hãy thử làm kem xoài hoặc xoài sấy để có món ăn vặt lành mạnh. Với hương vị nhiệt đới và lợi ích sức khỏe, xoài là trái cây đáng để thưởng thức.','2025-05-19','Xoài giàu vitamin C và chất xơ, mang đến hương vị nhiệt đới ngọt ngào.','mango_image.png','xoai-nhiet-doi','Xoài: Hương Vị Nhiệt Đới Ngọt Ngào');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` double NOT NULL,
  `quantity` int NOT NULL,
  `fruit_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbrtphvnegosfuuio6gjub008` (`fruit_id`),
  KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKbrtphvnegosfuuio6gjub008` FOREIGN KEY (`fruit_id`) REFERENCES `fruits` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,25000,1,37,1),(2,51000,2,38,1),(5,40500,1,36,4),(6,30000,1,45,4),(7,120000,1,44,4);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `recipient_name` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `vnp_txn_ref` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2025-12-18 22:12:07.362692','COD','PENDING','0338262362','toi','HoangMai,HaNoi','DELIVERED',127000,NULL,12),(3,'2025-12-12 22:19:25.086270','COD','PENDING','0338262362','tao2','GiaiPhong,Hanoi','DELIVERED',1000000,NULL,12),(4,'2025-12-19 17:29:16.462933','COD','PENDING','0333333333','chinhlatoi','bangkok,thailand','CANCELLED',190500,NULL,12);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (5,'ADMIN'),(4,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  KEY `FKhfh9dx7w3ubf1co1vdev94g3f` (`user_id`),
  KEY `FKh8ciramu9cc9q3qcqiv4ue8a6` (`role_id`),
  CONSTRAINT `FKh8ciramu9cc9q3qcqiv4ue8a6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,5),(12,4),(13,4);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `birthdate` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,NULL,'admin@gmail.com','','$2a$10$9WGJ.KvQCTQCUDn8OB28RublhaxslXlsBbRCoFfWGJDEPYSsfIvsS',NULL,'admin',NULL),(12,'zzzzzzzz','hien@gmail.com','Hienn','$2a$10$Zije3o6Wue6kyBTuB5df1O3ZNUe45ZusABOcQSij9WrUTuvwZmalK','0338262362','hientest',NULL),(13,NULL,'hiennguyennhu2004@gmail.com','','$2a$10$wT5naEGI7217hxeacmYMiOQskpdVScYAQL5397xbHJQyvzB1A6Uau',NULL,'hiendodihoc',NULL);
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

-- Dump completed on 2025-12-20 23:17:03
