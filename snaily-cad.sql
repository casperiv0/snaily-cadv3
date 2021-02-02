-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2020 at 03:33 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `snaily-cad`
--

-- --------------------------------------------------------

--
-- Table structure for table `911calls`
--

CREATE TABLE `911calls` (
  `id` varchar(255) NOT NULL,
  `description` varchar(1800) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `assigned_unit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `action_logs`
--

CREATE TABLE `action_logs` (
  `id` varchar(255) NOT NULL,
  `action_title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `arrest_reports`
--

CREATE TABLE `arrest_reports` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `charges` text NOT NULL,
  `officer_name` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `postal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bleets`
--

CREATE TABLE `bleets` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `markdown` text NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `uploaded_at` varchar(255) NOT NULL,
  `image_id` text NOT NULL,
  `pinned` varchar(255) NOT NULL,
  `likes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bolos`
--

CREATE TABLE `bolos` (
  `id` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `plate` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `whitelisted` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `cad_info`
--

CREATE TABLE `cad_info` (
  `id` int(11) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `cad_name` varchar(255) NOT NULL,
  `AOP` varchar(255) NOT NULL,
  `tow_whitelisted` varchar(255) NOT NULL,
  `whitelisted` varchar(255) NOT NULL,
  `company_whitelisted` varchar(255) NOT NULL,
  `webhook_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `citizens`
--

CREATE TABLE `citizens` (
  `id` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `birth` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `ethnicity` varchar(255) NOT NULL,
  `hair_color` varchar(255) NOT NULL,
  `eye_color` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `height` varchar(255) NOT NULL,
  `weight` varchar(255) NOT NULL,
  `dmv` varchar(255) NOT NULL,
  `fire_license` varchar(255) NOT NULL,
  `pilot_license` varchar(255) NOT NULL,
  `ccw` varchar(255) NOT NULL,
  `business` varchar(255) NOT NULL,
  `business_id` varchar(255) NOT NULL,
  `rank` varchar(255) NOT NULL,
  `vehicle_reg` varchar(255) NOT NULL,
  `posts` varchar(255) NOT NULL,
  `image_id` varchar(255) NOT NULL,
  `b_status` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `court_requests`
--

CREATE TABLE `court_requests` (
  `id` varchar(255) NOT NULL,
  `warrants` varchar(2500) NOT NULL,
  `arrest_reports` varchar(2500) NOT NULL,
  `tickets` varchar(2500) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ems-fd`
--

CREATE TABLE `ems-fd` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `status2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ethnicities`
--

CREATE TABLE `ethnicities` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `legal_statuses`
--

CREATE TABLE `legal_statuses` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `leo_tickets`
--

CREATE TABLE `leo_tickets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `violations` varchar(255) NOT NULL,
  `officer_name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `postal` varchar(255) NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `short_info` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `officers`
--

CREATE TABLE `officers` (
  `id` varchar(255) NOT NULL,
  `officer_name` varchar(255) NOT NULL,
  `officer_dept` varchar(255) NOT NULL,
  `callsign` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `status2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` varchar(255) NOT NULL,
  `business_id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `uploaded_at` varchar(255) NOT NULL,
  `uploaded_by` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `registered_cars`
--

CREATE TABLE `registered_cars` (
  `id` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `vehicle` varchar(255) NOT NULL,
  `vin_number` varchar(255) NOT NULL,
  `in_status` varchar(255) NOT NULL,
  `plate` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `business_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `registered_weapons`
--

CREATE TABLE `registered_weapons` (
  `id` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `weapon` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tow_calls`
--

CREATE TABLE `tow_calls` (
  `id` varchar(255) NOT NULL,
  `description` varchar(1800) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `taxi_calls`
--

CREATE TABLE `taxi_calls` (
  `id` varchar(255) NOT NULL,
  `description` varchar(1800) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `truck_logs`
--

CREATE TABLE `truck_logs` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  `co_driver` varchar(255) NOT NULL,
  `start_time` varchar(255) NOT NULL,
  `plate` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rank` varchar(255) NOT NULL,
  `leo` varchar(255) NOT NULL,
  `ems_fd` varchar(255) NOT NULL,
  `dispatch` varchar(255) NOT NULL,
  `tow` varchar(255) NOT NULL,
  `banned` varchar(255) NOT NULL,
  `ban_reason` varchar(255) NOT NULL,
  `whitelist_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `defaults`) VALUES
(1, 'Albany Alpha		', '1'),
(2, 'Albany Buccaneer		', '1'),
(3, 'Albany Buccaneer Custom		', '1'),
(4, 'Albany Cavalcade		', '1'),
(5, 'Albany Cavalcade FXT		', '1'),
(6, 'Albany Emperor		', '1'),
(7, 'Albany Esperanto		', '1'),
(8, 'Albany Franken Stange		', '1'),
(9, 'Albany Hermes		', '1'),
(10, 'Albany Lurcher		', '1'),
(11, 'Albany Manana		', '1'),
(12, 'Albany Police Roadcruiser		', '1'),
(13, 'Albany Presidente		', '1'),
(14, 'Albany Primo		', '1'),
(15, 'Albany Primo Custom		', '1'),
(16, 'Albany Taxi Cab		', '1'),
(17, 'Albany Romero		', '1'),
(18, 'Albany Roosevelt		', '1'),
(19, 'Albany Roosevelt Valor		', '1'),
(20, 'Albany Stretch		', '1'),
(21, 'Albany Virgo		', '1'),
(22, 'Albany Washington		', '1'),
(23, 'Annis Elergy Retro Custom		', '1'),
(24, 'Annis Elergy RH8		', '1'),
(25, 'Annis RE7B		', '1'),
(26, 'Annis Savestra		', '1'),
(27, 'Benefactor Dubsta		', '1'),
(28, 'Benefactor Dubsta 6X6		', '1'),
(29, 'Benefactor Feltzer		', '1'),
(30, 'Benefactor Glendale		', '1'),
(31, 'Benefactor Panto		', '1'),
(32, 'Benefactor Schafter		', '1'),
(33, 'Benefactor Schafter LWB		', '1'),
(34, 'Benefactor Schafter LWB Armored		', '1'),
(35, 'Benefactor Schafter V12		', '1'),
(36, 'Benefactor Schafter V12 Armored		', '1'),
(37, 'Benefactor Schwartzer		', '1'),
(38, 'Benefactor Serrano		', '1'),
(39, 'Benefactor Stirling GT		', '1'),
(40, 'Benefactor Streiter		', '1'),
(41, 'Benefactor Surano		', '1'),
(42, 'Benefactor Terrorbyte		', '1'),
(43, 'Benefactor Turreted Limo		', '1'),
(44, 'Benefactor XLS		', '1'),
(45, 'Benefactor XLS Armored		', '1'),
(46, 'BF Bifta		', '1'),
(47, 'BF Dune Buggy		', '1'),
(48, 'BF Dune FAV		', '1'),
(49, 'BF Injection		', '1'),
(50, 'BF Ramp Buggy		', '1'),
(51, 'BF Raptor		', '1'),
(52, 'BF Space Docker		', '1'),
(53, 'BF Surfer		', '1'),
(54, 'Bollokan Prairie		', '1'),
(55, 'Bravado	Banshee		', '1'),
(56, 'Bravado	Banshee Topless		', '1'),
(57, 'Bravado	Banshee 900R		', '1'),
(58, 'Bravado	Bison		', '1'),
(59, 'Bravado	Buffalo		', '1'),
(60, 'Bravado	Buffalo S		', '1'),
(61, 'Bravado	Duneloader		', '1'),
(62, 'Bravado	FIB Buffalo		', '1'),
(63, 'Bravado	Gauntlet		', '1'),
(64, 'Bravado	Gresley		', '1'),
(65, 'Bravado	HalfTrack		', '1'),
(66, 'Bravado	Paradise		', '1'),
(67, 'Bravado	Police Cruiser Buffalo		', '1'),
(68, 'Bravado	RatLoader		', '1'),
(69, 'Bravado	RatTruck		', '1'),
(70, 'Bravado	Redwood Gauntlet		', '1'),
(71, 'Bravado	Rumpo		', '1'),
(72, 'Bravado	Rumpo Custom		', '1'),
(73, 'Bravado	Sprunk Buffalo		', '1'),
(74, 'Bravado	Verlierer		', '1'),
(75, 'Bravado	Youga		', '1'),
(76, 'Bravado	Youga Classic		', '1'),
(77, 'Brute Airport Bus		', '1'),
(78, 'Brute Ambulance		', '1'),
(79, 'Brute Boxville		', '1'),
(80, 'Brute Boxville Armored		', '1'),
(81, 'Brute Bus		', '1'),
(82, 'Brute Camper		', '1'),
(83, 'Brute Dashound		', '1'),
(84, 'Brute Police Riot		', '1'),
(85, 'Brute Pony		', '1'),
(86, 'Brute Rental Shuttle Bus	', '1'),
(87, 'Brute Stockade		', '1'),
(88, 'Brute Taco Van		', '1'),
(89, 'Brute Tipper		', '1'),
(90, 'Brute Tipper Classic		', '1'),
(91, 'Brute Tour Bus		', '1'),
(92, 'Brute Utility Truck		', '1'),
(93, 'Brute Cherry Picker Utility Truck		', '1'),
(94, 'Canis Bohdi		', '1'),
(95, 'Canis Crusader		', '1'),
(96, 'Canis Kalahari		', '1'),
(97, 'Canis Kalahari Topless		', '1'),
(98, 'Canis Kamacho		', '1'),
(99, 'Canis Mesa		', '1'),
(100, 'Canis Merryweather Mesa		', '1'),
(101, 'Canis Seminole		', '1'),
(102, 'Chariot Romero Hearse		', '1'),
(103, 'Cheval Fugitive		', '1'),
(104, 'Cheval Marshall		', '1'),
(105, 'Cheval Picador		', '1'),
(106, 'Cheval Surge		', '1'),
(107, 'Cheval Taipan		', '1'),
(108, 'Coil Brawler		', '1'),
(109, 'Coil Cyclone		', '1'),
(110, 'Coil Raiden		', '1'),
(111, 'Coil Rocket Voltic		', '1'),
(112, 'Coil Voltic		', '1'),
(113, 'Coil Topless Voltic		', '1'),
(114, 'Declasse Asea		', '1'),
(115, 'Declasse Burger Shot Stallion		', '1'),
(116, 'Declasse Burrito		', '1'),
(117, 'Declasse Drift Tampa		', '1'),
(118, 'Declasse FIB Granger		', '1'),
(119, 'Declasse LMC Biker Burrito		', '1'),
(120, 'Declasse Granger		', '1'),
(121, 'Declasse Hotring Sabre		', '1'),
(122, 'Declasse Lifegaurd Granger		', '1'),
(123, 'Declasse Mamba		', '1'),
(124, 'Declasse Moonbeam		', '1'),
(125, 'Declasse Moonbeam Custom		', '1'),
(126, 'Declasse Park Ranger Granger		', '1'),
(127, 'Declasse Police Rancher		', '1'),
(128, 'Declasse Police Transport Van		', '1'),
(129, 'Declasse Premier		', '1'),
(130, 'Declasse Rancher XL		', '1'),
(131, 'Declasse Rhapsody		', '1'),
(132, 'Declasse Sabre Turbo		', '1'),
(133, 'Declasse Sabre Turbo Custom		', '1'),
(134, 'Declasse Sheriff Granger		', '1'),
(135, 'Declasse Stallion		', '1'),
(136, 'Declasse Tampa		', '1'),
(137, 'Declasse Tornado		', '1'),
(138, 'Declasse Tornado Convertible		', '1'),
(139, 'Declasse Tornado Custom		', '1'),
(140, 'Declasse Tornado Rat Rod		', '1'),
(141, 'Declasse Vigero		', '1'),
(142, 'Declasse Voodoo		', '1'),
(143, 'Declasse Voodoo Custom		', '1'),
(144, 'Declasse Weaponized Tampa		', '1'),
(145, 'Declasse Yosemite		', '1'),
(146, 'Dewbauchee Exemplar		', '1'),
(147, 'Dewbauchee JB 700		', '1'),
(148, 'Dewbauchee Massacro		', '1'),
(149, 'Dewbauchee Massacro RaceCar		', '1'),
(150, 'Dewbauchee Rapid GT		', '1'),
(151, 'Dewbauchee Rapid GT Classic		', '1'),
(152, 'Dewbauchee Rapid GT Sports		', '1'),
(153, 'Dewbauchee Seven - 70		', '1'),
(154, 'Dewbauchee Specter		', '1'),
(155, 'Dewbauchee Specter Custom		', '1'),
(156, 'Dewbauchee Vagner		', '1'),
(157, 'Dinka Akuma		', '1'),
(158, 'Dinka Blista		', '1'),
(159, 'Dinka Blista Compact		', '1'),
(160, 'Dinka Double - T		', '1'),
(161, 'Dinka Enduro		', '1'),
(162, 'Dinka Go - Go Monkey Blista		', '1'),
(163, 'Dinka Jester		', '1'),
(164, 'Dinka Jester RaceCar		', '1'),
(165, 'Dinka Jester Classic		', '1'),
(166, 'Dinka Thrust		', '1'),
(167, 'Dinka Vindicator		', '1'),
(168, 'Dundreary Landstalker		', '1'),
(169, 'Dundreary Regina		', '1'),
(170, 'Dundreary Stretch		', '1'),
(171, 'Dundreary Virgo Classic		', '1'),
(172, 'Dundreary Virgo Classic Custom		', '1'),
(173, 'Emperor	ETR1		', '1'),
(174, 'Emperor	Habanero		', '1'),
(175, 'Enus Cognoscenti		', '1'),
(176, 'Enus Cognoscenti Armored		', '1'),
(177, 'Enus Cognoscenti 55		', '1'),
(178, 'Enus Cognoscenti 55 Armored', '1'),
(179, 'Enus Cognoscenti Cabrio', '1'),
(180, 'Enus Huntley S', '1'),
(181, 'Enus Stafford', '1'),
(182, 'Enus Super Diamond', '1'),
(183, 'Enus Windsor', '1'),
(184, 'Enus Windsor Drop', '1'),
(185, 'Fathom	FQ 2', '1'),
(186, 'Gallivanter Baller Classic', '1'),
(187, 'Gallivanter Baller		', '1'),
(188, 'Gallivanter Baller LE		', '1'),
(189, 'Gallivanter Baller LE Armored		', '1'),
(190, 'Gallivanter Baller LE LWB		', '1'),
(191, 'Gallivanter Baller LE LWB Armored		', '1'),
(192, 'Grotti Bestia GTS		', '1'),
(193, 'Grotti Brioso R / A		', '1'),
(194, 'Grotti Carbonizzare		', '1'),
(195, 'Grotti Cheetah		', '1'),
(196, 'Grotti Cheetah Classic		', '1'),
(197, 'Grotti GT500		', '1'),
(198, 'Grotti Stinger		', '1'),
(199, 'Grotti Topless Stinger		', '1'),
(200, 'Grotti Stinger GT		', '1'),
(201, 'Grotti Turismo Classic		', '1'),
(202, 'Grotti Turismo R		', '1'),
(203, 'Grotti Vigilante		', '1'),
(204, 'Grotti Visione		', '1'),
(205, 'Grotti X80 Proto		', '1'),
(206, 'Hijak Khamelion		', '1'),
(207, 'Hijak Ruston		', '1'),
(208, 'HVY	Airtug		', '1'),
(209, 'HVY	APC Tank		', '1'),
(210, 'HVY	Barracks		', '1'),
(211, 'HVY	Barracks Semi		', '1'),
(212, 'HVY	Biff		', '1'),
(213, 'HVY	Chernobog		', '1'),
(214, 'HVY	Crane		', '1'),
(215, 'HVY	Cutter		', '1'),
(216, 'HVY	Dock Handler		', '1'),
(217, 'HVY	Docktug		', '1'),
(218, 'HVY	Dozer		', '1'),
(219, 'HVY	Dump		', '1'),
(220, 'HVY	Forklift		', '1'),
(221, 'HVY	Insurgent		', '1'),
(222, 'HVY	Insurgent Pick - Up		', '1'),
(223, 'HVY	Insurgent Pick - up Custom		', '1'),
(224, 'HVY	Mixer Classic		', '1'),
(225, 'HVY	Mixer		', '1'),
(226, 'HVY	Nightshark		', '1'),
(227, 'HVY	Ripley		', '1'),
(228, 'HVY	Skylift		', '1'),
(229, 'Imponte	Deluxo		', '1'),
(230, 'Imponte	Duke O Death		', '1'),
(231, 'Imponte	Dukes		', '1'),
(232, 'Imponte	Nightshade		', '1'),
(233, 'Imponte	Phoenix		', '1'),
(234, 'Imponte	Ruiner		', '1'),
(235, 'Imponte	Ruiner 2000		', '1'),
(236, 'Invetero Coquette		', '1'),
(237, 'Invetero Coquette Topless		', '1'),
(238, 'Invetero Coquette BlackFin		', '1'),
(239, 'Invetero Coquette Classic		', '1'),
(240, 'Invetero Coquette Classic Topless		', '1'),
(241, 'Jacksheepe Lawn Mower		', '1'),
(242, 'JoBuilt	Hauler		', '1'),
(243, 'JoBuilt	Hauler Custom		', '1'),
(244, 'JoBuilt	Phantom		', '1'),
(245, 'JoBuilt	Phantom Custom		', '1'),
(246, 'JoBuilt	Phantom Wedge		', '1'),
(247, 'JoBuilt	Rubble		', '1'),
(248, 'JoBuilt	Trashmaster		', '1'),
(249, 'Karin 190z		', '1'),
(250, 'Karin Asterope		', '1'),
(251, 'Karin BeeJay XL		', '1'),
(252, 'Karin Dilettante		', '1'),
(253, 'Karin Dilettante Patrol Vehicle		', '1'),
(254, 'Karin Futo		', '1'),
(255, 'Karin Intruder		', '1'),
(256, 'Karin Kuruma		', '1'),
(257, 'Karin Kuruma Armored		', '1'),
(258, 'Karin Rebel		', '1'),
(259, 'Karin Sultan		', '1'),
(260, 'Karin Sultan RS		', '1'),
(261, 'Karin Technical		', '1'),
(262, 'Karin Technical Aqua		', '1'),
(263, 'Karin Technical Custom		', '1'),
(264, 'Lampadati Casco		', '1'),
(265, 'Lampadati Felon		', '1'),
(266, 'Lampadati Felon GT		', '1'),
(267, 'Lampadati Furore GT		', '1'),
(268, 'Lampadati Michelli GT		', '1'),
(269, 'Lampadati Pigalle		', '1'),
(270, 'Lampadati Tropos Rallye		', '1'),
(271, 'Lampadati Viseris		', '1'),
(272, 'LCC	Avarus		', '1'),
(273, 'LCC	Hexer		', '1'),
(274, 'LCC	Innovation		', '1'),
(275, 'LCC	Sanctus		', '1'),
(276, 'Maibatsu Manchez		', '1'),
(277, 'Maibatsu Mule		', '1'),
(278, 'Maibatsu Mule Armored		', '1'),
(279, 'Maibatsu Mule Custom		', '1'),
(280, 'Maibatsu Penumbra		', '1'),
(281, 'Maibatsu Sanchez		', '1'),
(282, 'Maibatsu Sanchez w / Livery		', '1'),
(283, 'Mammoth	Patriot		', '1'),
(284, 'Mammoth	Patriot Stretch		', '1'),
(285, 'Mammoth	Thruster Jetpack		', '1'),
(286, 'MTL	Brickade		', '1'),
(287, 'MTL	Dune		', '1'),
(288, 'MTL	Fire Truck		', '1'),
(289, 'MTL	Flatbed		', '1'),
(290, 'MTL	Packer		', '1'),
(291, 'MTL	Pounder		', '1'),
(292, 'MTL	Pounder Custom		', '1'),
(293, 'MTL	Wastelander		', '1'),
(294, 'Nagasaki BF400		', '1'),
(295, 'Nagasaki Blazer		', '1'),
(296, 'Nagasaki Blazer Aqua		', '1'),
(297, 'Nagasaki Blazer Lifeguard		', '1'),
(298, 'Nagasaki Caddy		', '1'),
(299, 'Nagasaki Bunker Caddy		', '1'),
(300, 'Nagasaki Caddy Utility		', '1'),
(301, 'Nagasaki Carbon RS		', '1'),
(302, 'Nagasaki Chimera		', '1'),
(303, 'Nagasaki Hot Rod Blazer		', '1'),
(304, 'Nagasaki Shotaro		', '1'),
(305, 'Nagasaki Street Blazer		', '1'),
(306, 'Obey 9F		', '1'),
(307, 'Obey 9F Cabrio		', '1'),
(308, 'Obey Omnis		', '1'),
(309, 'Obey Rocoto		', '1'),
(310, 'Obey Tailgater		', '1'),
(311, 'Ocelot Ardent		', '1'),
(312, 'Ocelet F620		', '1'),
(313, 'Ocelet Jackal		', '1'),
(314, 'Ocelet Lynx		', '1'),
(315, 'Ocelet Pariah		', '1'),
(316, 'Ocelet Penetrator		', '1'),
(317, 'Ocelet Stromberg		', '1'),
(318, 'Ocelet Swinger		', '1'),
(319, 'Ocelet XA - 21		', '1'),
(320, 'Overflod Autarch		', '1'),
(321, '  Overflod Entity XF		', '1'),
(322, '  Overflod Entity XXR		', '1'),
(323, '  Overflod Tyrant		', '1'),
(324, '  Pegassi Bati 801		', '1'),
(325, '  Pegassi Bati 801RR		', '1'),
(326, '  Pegassi Esskey		', '1'),
(327, '  Pegassi Faggio		', '1'),
(328, '  Pegassi Faggio Mod		', '1'),
(329, '  Pegassi FCR 1000		', '1'),
(330, '  Pegassi FCR 1000 Custom		', '1'),
(331, '  Pegassi Infernus		', '1'),
(332, '  Pegassi Infernus Classic		', '1'),
(333, '  Pegassi Monroe		', '1'),
(334, '  Pegassi Oppressor		', '1'),
(335, '  Pegassi Oppressor MK II		', '1'),
(336, '  Pegassi Osiris		', '1'),
(337, '  Pegassi Reaper		', '1'),
(338, '  Pegassi Ruffian		', '1'),
(339, '  Pegassi Tempesta		', '1'),
(340, '  Pegassi Tezeract		', '1'),
(341, '  Pegassi Torero		', '1'),
(342, '  Pegassi Vacca		', '1'),
(343, '  Pegassi Vortex		', '1'),
(344, '  Pegassi Zentorno		', '1'),
(345, '  Pfister 811		', '1'),
(346, '  Pfister Comet		', '1'),
(347, '  Pfister Comet Retro Custom		', '1'),
(348, '  Pfister Comet Safari		', '1'),
(349, '  Pfister Comet SR		', '1'),
(350, '  Pfister Neon		', '1'),
(351, '  Principe Diabolus		', '1'),
(352, '  Principe Diabolus Custom		', '1'),
(353, '  Principe Lectro		', '1'),
(354, '  Principe Nemesis		', '1'),
(355, '  Progen GP1		', '1'),
(356, '  Progen Itali GTB		', '1'),
(357, '  Progen Itali GTB Custom		', '1'),
(358, '  Progen T20		', '1'),
(359, '  Progen Tyrus		', '1'),
(360, '  RUNE Cheburek		', '1'),
(361, '  Schyster Fusilade		', '1'),
(362, '  Shitzu Defiler		', '1'),
(363, '  Shitzu Hakuchou		', '1'),
(364, '  Shitzu Hakuchou Drag Bike		', '1'),
(365, '  Shitzu PCJ 600		', '1'),
(366, '  Shitzu Vader		', '1'),
(367, '  Stanley	Fieldmaster		', '1'),
(368, '  Stanley	Tractor		', '1'),
(369, '  Truffade Adder		', '1'),
(370, '  Truffade Nero		', '1'),
(371, '  Truffade Nero Custom		', '1'),
(372, '  Truffade Z - Type		', '1'),
(373, '  Ubermacht Oracle		', '1'),
(374, '  Ubermacht Oracle XS		', '1'),
(375, '  Ubermacht Revolter		', '1'),
(376, '  Ubermacht SC1		', '1'),
(377, '  Ubermacht Sentinel		', '1'),
(378, '  Ubermacht Sentinel Classic		', '1'),
(379, '  Ubermacht Sentinel XS		', '1'),
(380, '  Ubermacht Zion		', '1'),
(381, '  Ubermacht Zion Cabrio		', '1'),
(382, '  Vapid Benson		', '1'),
(383, '  Vapid Blade		', '1'),
(384, '  Vapid Bobcat XL		', '1'),
(385, '  Vapid Bullet		', '1'),
(386, '  Vapid Caracara		', '1'),
(387, '  Vapid Chino		', '1'),
(388, '  Vapid Chino Custom		', '1'),
(389, '  Vapid Clown Van		', '1'),
(390, '  Vapid Contender		', '1'),
(391, '  Vapid Desert Raid		', '1'),
(392, '  Vapid Dominator		', '1'),
(393, '  Vapid Dominator GTX		', '1'),
(394, '  Vapid Ellie		', '1'),
(395, '  Vapid Flash GT		', '1'),
(396, '  Vapid FMJ		', '1'),
(397, '  Vapid GB200		', '1'),
(398, '  Vapid Guardian		', '1'),
(399, '  Vapid Hotknife		', '1'),
(400, '  Vapid Hustler		', '1'),
(401, '  Vapid Minivan		', '1'),
(402, '  Vapid Minivan Custom		', '1'),
(403, '  Vapid Peyote		', '1'),
(404, '  Vapid Pibwasser		', '1'),
(405, '  Vapid Police Cruiser		', '1'),
(406, '  Vapid Police Interceptor		', '1'),
(407, '  Vapid Police Prison Bus		', '1'),
(408, '  Vapid Radius		', '1'),
(409, '  Vapid Retinue		', '1'),
(410, '  Vapid Riata		', '1'),
(411, '  Vapid Sadler		', '1'),
(412, '  Vapid Sandking SWB		', '1'),
(413, '  Vapid Sandking XL		', '1'),
(414, '  Vapid Scrap Truck		', '1'),
(415, '  Vapid Sheriff Cruiser		', '1'),
(416, '  Vapid Slamvan		', '1'),
(417, '  Vapid Slamvan Custom		', '1'),
(418, '  Vapid Speedo		', '1'),
(419, '  Vapid Speedo Custom		', '1'),
(420, '  Vapid Stanier		', '1'),
(421, '  Vapid Taxi		', '1'),
(422, '  Vapid Liberator		', '1'),
(423, '  Vapid Tow Truck		', '1'),
(424, '  Vapid Large Tow Truck		', '1'),
(425, '  Vapid Trophy Truck		', '1'),
(426, '  Vapid Unmarked Cruiser		', '1'),
(427, '  Vapid Utility Truck		', '1'),
(428, '  Vulcar Fagaloa		', '1'),
(429, '  Vulcar Ingot		', '1'),
(430, '  Vulcar Warrener		', '1'),
(431, '  Weeny Issi		', '1'),
(432, '  Weeny Issi Classic		', '1'),
(433, '  Western Motorcycle Company	Bagger		', '1'),
(434, '  Western Motorcycle Company	Cliffhanger		', '1'),
(435, '  Western Motorcycle Company	Daemon		', '1'),
(436, '  Western Motorcycle Company	Daemon Custom	', '1'),
(437, '  Western Motorcycle Company	Gargoyle		', '1'),
(438, '  Western Motorcycle Company	Nightblade		', '1'),
(439, '  Western Motorcycle Company	Police Bike		', '1'),
(440, '  Western Motorcycle Company	Rat Bike		', '1'),
(441, '  Western Motorcycle Company	Sovereign		', '1'),
(442, '  Western Motorcycle Company	Wolfsbane		', '1'),
(443, '  Western Motorcycle Company	Zombie Bobber	', '1'),
(444, '  Western Motorcycle Company	Zombie Chopper	', '1'),
(445, '  Willard	Faction		', '1'),
(446, '  Willard	Faction Custom		', '1'),
(447, '  Willard	Faction Custom Donk		', '1'),
(448, '  Zirconium Journey', '1'),
(449, '  Zirconium Stratum', '1');

-- --------------------------------------------------------

--
-- Table structure for table `warrants`
--

CREATE TABLE `warrants` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `weapons`
--

CREATE TABLE `weapons` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `written_warnings`
--

CREATE TABLE `written_warnings` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `citizen_id` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `infractions` text NOT NULL,
  `officer_name` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `postal` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `911calls`
--
ALTER TABLE `911calls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `action_logs`
--
ALTER TABLE `action_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `arrest_reports`
--
ALTER TABLE `arrest_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bleets`
--
ALTER TABLE `bleets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bolos`
--
ALTER TABLE `bolos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cad_info`
--
ALTER TABLE `cad_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `citizens`
--
ALTER TABLE `citizens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `court_requests`
--
ALTER TABLE `court_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ems-fd`
--
ALTER TABLE `ems-fd`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ethnicities`
--
ALTER TABLE `ethnicities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `legal_statuses`
--
ALTER TABLE `legal_statuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leo_tickets`
--
ALTER TABLE `leo_tickets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registered_cars`
--
ALTER TABLE `registered_cars`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registered_weapons`
--
ALTER TABLE `registered_weapons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tow_calls`
--
ALTER TABLE `tow_calls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `taxi_calls`
--
ALTER TABLE `taxi_calls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `truck_logs`
--
ALTER TABLE `truck_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `warrants`
--
ALTER TABLE `warrants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `weapons`
--
ALTER TABLE `weapons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `written_warnings`
--
ALTER TABLE `written_warnings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cad_info`
--
ALTER TABLE `cad_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
