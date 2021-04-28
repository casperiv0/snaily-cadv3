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
  `type` varchar(255) NOT NULL,
  `assigned_unit` text NOT NULL,
  `hidden` varchar(255) NOT NULL,
  `pos` text NOT NULL
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
  `color` varchar(255) NOT NULL,
  `officer_name` text NOT NULL
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
  `webhook_url` text NOT NULL,
  `signal_100` varchar(255) NOT NULL,
  `live_map_url` text NOT NULL,
  `features` text NOT NULL,
  `plate_length` int(255) NOT NULL,
  `registration_code` varchar(255) NOT NULL,
  `steam_api_key` varchar(255) NOT NULL,
  `show_aop` varchar(255) NOT NULL DEFAULT '1',
  `max_citizens` varchar(255) NOT NULL DEFAULT 'unlimited'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `seo_tags`
--

CREATE TABLE `seo_tags` (
    `title` varchar(255) DEFAULT 'SnailyCAD',
    `description` text DEFAULT 'A free, fast, simple and secure open source CAD/MDT',
    `site_name` varchar(255) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `call_events`
--

CREATE TABLE `call_events` (
  `id` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `call_id` varchar(255) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `call_types`
--

CREATE TABLE `call_types` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `cad_licenses`
--

CREATE TABLE `cad_licenses` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `defaults` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
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
  `note` varchar(255) NOT NULL,
  `phone_nr` varchar(255) NOT NULL,
  `dead` varchar(255) NOT NULL,
  `dead_on` varchar(255) NOT NULL
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
  `status2` varchar(255) NOT NULL,
  `callsign` varchar(255) NOT NULL
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
  `violations` text NOT NULL,
  `officer_name` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `postal` varchar(255) NOT NULL,
  `notes` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `leo_incidents`
--

CREATE TABLE `leo_incidents` (
    `id` varchar(255) NOT NULL,
    `case_number` int(11) NOT NULL,
    `officer_dept` varchar(255) NOT NULL,
    `officer_name` varchar(255) NOT NULL,
    `full_date` text NOT NULL,
    `involved_officers` text NOT NULL,
    `location` varchar(255) NOT NULL,
    `officer_id` varchar(255) NOT NULL,
    `narrative` text NOT NULL,
    `injuries` varchar(255) NOT NULL,
    `arrests_made` varchar(255) NOT NULL,
    `firearms_involved` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
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
-- Table structure for table `mugshots`
--

CREATE TABLE `mugshots` (
    `id` varchar(255) NOT NULL,
    `citizen_id` varchar(255) NOT NULL,
    `data` text NOT NULL DEFAULT '[]',
    `officer_name` varchar(255) NOT NULL,
    `full_date` text NOT NULL,
    `officer_id` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `href` text NOT NULL,
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
  `rank` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `status2` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `officer_logs` (
  `id` varchar(255) NOT NULL,
  `officer_id` varchar(255) NOT NULL,
  `started_at` varchar(255) NOT NULL,
  `ended_at` varchar(255) NOT NULL,
  `active` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL
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
  `edit_passwords` varchar(255) NOT NULL,
  `leo` varchar(255) NOT NULL,
  `supervisor` varchar(255) NOT NULL,
  `ems_fd` varchar(255) NOT NULL,
  `dispatch` varchar(255) NOT NULL,
  `tow` varchar(255) NOT NULL,
  `banned` varchar(255) NOT NULL,
  `ban_reason` varchar(255) NOT NULL,
  `whitelist_status` varchar(255) NOT NULL,
  `avatar_url` varchar(255) NOT NULL,
  `steam_id` varchar(255) NOT NULL
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
(1, 'Albany Alpha', '1'),
(2, 'Albany Buccaneer', '1'),
(3, 'Albany Buccaneer Custom', '1'),
(4, 'Albany Cavalcade', '1'),
(5, 'Albany Cavalcade FXT', '1'),
(6, 'Albany Emperor', '1'),
(7, 'Albany Esperanto', '1'),
(8, 'Albany Franken Stange', '1'),
(9, 'Albany Hermes', '1'),
(10, 'Albany Lurcher', '1'),
(11, 'Albany Manana', '1'),
(12, 'Albany Police Roadcruiser', '1'),
(13, 'Albany Presidente', '1'),
(14, 'Albany Primo', '1'),
(15, 'Albany Primo Custom', '1'),
(16, 'Albany Taxi Cab', '1'),
(17, 'Albany Romero', '1'),
(18, 'Albany Roosevelt', '1'),
(19, 'Albany Roosevelt Valor', '1'),
(20, 'Albany Stretch', '1'),
(21, 'Albany Virgo', '1'),
(22, 'Albany Washington', '1'),
(23, 'Annis Elergy Retro Custom', '1'),
(24, 'Annis Elergy RH8', '1'),
(25, 'Annis RE7B', '1'),
(26, 'Annis Savestra', '1'),
(27, 'Benefactor Dubsta', '1'),
(28, 'Benefactor Dubsta 6X6', '1'),
(29, 'Benefactor Feltzer', '1'),
(30, 'Benefactor Glendale', '1'),
(31, 'Benefactor Panto', '1'),
(32, 'Benefactor Schafter', '1'),
(33, 'Benefactor Schafter LWB', '1'),
(34, 'Benefactor Schafter LWB Armored', '1'),
(35, 'Benefactor Schafter V12', '1'),
(36, 'Benefactor Schafter V12 Armored', '1'),
(37, 'Benefactor Schwartzer', '1'),
(38, 'Benefactor Serrano', '1'),
(39, 'Benefactor Stirling GT', '1'),
(40, 'Benefactor Streiter', '1'),
(41, 'Benefactor Surano', '1'),
(42, 'Benefactor Terrorbyte', '1'),
(43, 'Benefactor Turreted Limo', '1'),
(44, 'Benefactor XLS', '1'),
(45, 'Benefactor XLS Armored', '1'),
(46, 'BF Bifta', '1'),
(47, 'BF Dune Buggy', '1'),
(48, 'BF Dune FAV', '1'),
(49, 'BF Injection', '1'),
(50, 'BF Ramp Buggy', '1'),
(51, 'BF Raptor', '1'),
(52, 'BF Space Docker', '1'),
(53, 'BF Surfer', '1'),
(54, 'Bollokan Prairie', '1'),
(55, 'Bravado	Banshee', '1'),
(56, 'Bravado	Banshee Topless', '1'),
(57, 'Bravado	Banshee 900R', '1'),
(58, 'Bravado	Bison', '1'),
(59, 'Bravado	Buffalo', '1'),
(60, 'Bravado	Buffalo S', '1'),
(61, 'Bravado	Duneloader', '1'),
(62, 'Bravado	FIB Buffalo', '1'),
(63, 'Bravado	Gauntlet', '1'),
(64, 'Bravado	Gresley', '1'),
(65, 'Bravado	HalfTrack', '1'),
(66, 'Bravado	Paradise', '1'),
(67, 'Bravado	Police Cruiser Buffalo', '1'),
(68, 'Bravado	RatLoader', '1'),
(69, 'Bravado	RatTruck', '1'),
(70, 'Bravado	Redwood Gauntlet', '1'),
(71, 'Bravado	Rumpo', '1'),
(72, 'Bravado	Rumpo Custom', '1'),
(73, 'Bravado	Sprunk Buffalo', '1'),
(74, 'Bravado	Verlierer', '1'),
(75, 'Bravado	Youga', '1'),
(76, 'Bravado	Youga Classic', '1'),
(77, 'Brute Airport Bus', '1'),
(78, 'Brute Ambulance', '1'),
(79, 'Brute Boxville', '1'),
(80, 'Brute Boxville Armored', '1'),
(81, 'Brute Bus', '1'),
(82, 'Brute Camper', '1'),
(83, 'Brute Dashound', '1'),
(84, 'Brute Police Riot', '1'),
(85, 'Brute Pony', '1'),
(86, 'Brute Rental Shuttle Bus	', '1'),
(87, 'Brute Stockade', '1'),
(88, 'Brute Taco Van', '1'),
(89, 'Brute Tipper', '1'),
(90, 'Brute Tipper Classic', '1'),
(91, 'Brute Tour Bus', '1'),
(92, 'Brute Utility Truck', '1'),
(93, 'Brute Cherry Picker Utility Truck', '1'),
(94, 'Canis Bohdi', '1'),
(95, 'Canis Crusader', '1'),
(96, 'Canis Kalahari', '1'),
(97, 'Canis Kalahari Topless', '1'),
(98, 'Canis Kamacho', '1'),
(99, 'Canis Mesa', '1'),
(100, 'Canis Merryweather Mesa', '1'),
(101, 'Canis Seminole', '1'),
(102, 'Chariot Romero Hearse', '1'),
(103, 'Cheval Fugitive', '1'),
(104, 'Cheval Marshall', '1'),
(105, 'Cheval Picador', '1'),
(106, 'Cheval Surge', '1'),
(107, 'Cheval Taipan', '1'),
(108, 'Coil Brawler', '1'),
(109, 'Coil Cyclone', '1'),
(110, 'Coil Raiden', '1'),
(111, 'Coil Rocket Voltic', '1'),
(112, 'Coil Voltic', '1'),
(113, 'Coil Topless Voltic', '1'),
(114, 'Declasse Asea', '1'),
(115, 'Declasse Burger Shot Stallion', '1'),
(116, 'Declasse Burrito', '1'),
(117, 'Declasse Drift Tampa', '1'),
(118, 'Declasse FIB Granger', '1'),
(119, 'Declasse LMC Biker Burrito', '1'),
(120, 'Declasse Granger', '1'),
(121, 'Declasse Hotring Sabre', '1'),
(122, 'Declasse Lifegaurd Granger', '1'),
(123, 'Declasse Mamba', '1'),
(124, 'Declasse Moonbeam', '1'),
(125, 'Declasse Moonbeam Custom', '1'),
(126, 'Declasse Park Ranger Granger', '1'),
(127, 'Declasse Police Rancher', '1'),
(128, 'Declasse Police Transport Van', '1'),
(129, 'Declasse Premier', '1'),
(130, 'Declasse Rancher XL', '1'),
(131, 'Declasse Rhapsody', '1'),
(132, 'Declasse Sabre Turbo', '1'),
(133, 'Declasse Sabre Turbo Custom', '1'),
(134, 'Declasse Sheriff Granger', '1'),
(135, 'Declasse Stallion', '1'),
(136, 'Declasse Tampa', '1'),
(137, 'Declasse Tornado', '1'),
(138, 'Declasse Tornado Convertible', '1'),
(139, 'Declasse Tornado Custom', '1'),
(140, 'Declasse Tornado Rat Rod', '1'),
(141, 'Declasse Vigero', '1'),
(142, 'Declasse Voodoo', '1'),
(143, 'Declasse Voodoo Custom', '1'),
(144, 'Declasse Weaponized Tampa', '1'),
(145, 'Declasse Yosemite', '1'),
(146, 'Dewbauchee Exemplar', '1'),
(147, 'Dewbauchee JB 700', '1'),
(148, 'Dewbauchee Massacro', '1'),
(149, 'Dewbauchee Massacro RaceCar', '1'),
(150, 'Dewbauchee Rapid GT', '1'),
(151, 'Dewbauchee Rapid GT Classic', '1'),
(152, 'Dewbauchee Rapid GT Sports', '1'),
(153, 'Dewbauchee Seven - 70', '1'),
(154, 'Dewbauchee Specter', '1'),
(155, 'Dewbauchee Specter Custom', '1'),
(156, 'Dewbauchee Vagner', '1'),
(157, 'Dinka Akuma', '1'),
(158, 'Dinka Blista', '1'),
(159, 'Dinka Blista Compact', '1'),
(160, 'Dinka Double - T', '1'),
(161, 'Dinka Enduro', '1'),
(162, 'Dinka Go - Go Monkey Blista', '1'),
(163, 'Dinka Jester', '1'),
(164, 'Dinka Jester RaceCar', '1'),
(165, 'Dinka Jester Classic', '1'),
(166, 'Dinka Thrust', '1'),
(167, 'Dinka Vindicator', '1'),
(168, 'Dundreary Landstalker', '1'),
(169, 'Dundreary Regina', '1'),
(170, 'Dundreary Stretch', '1'),
(171, 'Dundreary Virgo Classic', '1'),
(172, 'Dundreary Virgo Classic Custom', '1'),
(173, 'Emperor	ETR1', '1'),
(174, 'Emperor	Habanero', '1'),
(175, 'Enus Cognoscenti', '1'),
(176, 'Enus Cognoscenti Armored', '1'),
(177, 'Enus Cognoscenti 55', '1'),
(178, 'Enus Cognoscenti 55 Armored', '1'),
(179, 'Enus Cognoscenti Cabrio', '1'),
(180, 'Enus Huntley S', '1'),
(181, 'Enus Stafford', '1'),
(182, 'Enus Super Diamond', '1'),
(183, 'Enus Windsor', '1'),
(184, 'Enus Windsor Drop', '1'),
(185, 'Fathom	FQ 2', '1'),
(186, 'Gallivanter Baller Classic', '1'),
(187, 'Gallivanter Baller', '1'),
(188, 'Gallivanter Baller LE', '1'),
(189, 'Gallivanter Baller LE Armored', '1'),
(190, 'Gallivanter Baller LE LWB', '1'),
(191, 'Gallivanter Baller LE LWB Armored', '1'),
(192, 'Grotti Bestia GTS', '1'),
(193, 'Grotti Brioso R / A', '1'),
(194, 'Grotti Carbonizzare', '1'),
(195, 'Grotti Cheetah', '1'),
(196, 'Grotti Cheetah Classic', '1'),
(197, 'Grotti GT500', '1'),
(198, 'Grotti Stinger', '1'),
(199, 'Grotti Topless Stinger', '1'),
(200, 'Grotti Stinger GT', '1'),
(201, 'Grotti Turismo Classic', '1'),
(202, 'Grotti Turismo R', '1'),
(203, 'Grotti Vigilante', '1'),
(204, 'Grotti Visione', '1'),
(205, 'Grotti X80 Proto', '1'),
(206, 'Hijak Khamelion', '1'),
(207, 'Hijak Ruston', '1'),
(208, 'HVY	Airtug', '1'),
(209, 'HVY	APC Tank', '1'),
(210, 'HVY	Barracks', '1'),
(211, 'HVY	Barracks Semi', '1'),
(212, 'HVY	Biff', '1'),
(213, 'HVY	Chernobog', '1'),
(214, 'HVY	Crane', '1'),
(215, 'HVY	Cutter', '1'),
(216, 'HVY	Dock Handler', '1'),
(217, 'HVY	Docktug', '1'),
(218, 'HVY	Dozer', '1'),
(219, 'HVY	Dump', '1'),
(220, 'HVY	Forklift', '1'),
(221, 'HVY	Insurgent', '1'),
(222, 'HVY	Insurgent Pick - Up', '1'),
(223, 'HVY	Insurgent Pick - up Custom', '1'),
(224, 'HVY	Mixer Classic', '1'),
(225, 'HVY	Mixer', '1'),
(226, 'HVY	Nightshark', '1'),
(227, 'HVY	Ripley', '1'),
(228, 'HVY	Skylift', '1'),
(229, 'Imponte	Deluxo', '1'),
(230, 'Imponte	Duke O Death', '1'),
(231, 'Imponte	Dukes', '1'),
(232, 'Imponte	Nightshade', '1'),
(233, 'Imponte	Phoenix', '1'),
(234, 'Imponte	Ruiner', '1'),
(235, 'Imponte	Ruiner 2000', '1'),
(236, 'Invetero Coquette', '1'),
(237, 'Invetero Coquette Topless', '1'),
(238, 'Invetero Coquette BlackFin', '1'),
(239, 'Invetero Coquette Classic', '1'),
(240, 'Invetero Coquette Classic Topless', '1'),
(241, 'Jacksheepe Lawn Mower', '1'),
(242, 'JoBuilt	Hauler', '1'),
(243, 'JoBuilt	Hauler Custom', '1'),
(244, 'JoBuilt	Phantom', '1'),
(245, 'JoBuilt	Phantom Custom', '1'),
(246, 'JoBuilt	Phantom Wedge', '1'),
(247, 'JoBuilt	Rubble', '1'),
(248, 'JoBuilt	Trashmaster', '1'),
(249, 'Karin 190z', '1'),
(250, 'Karin Asterope', '1'),
(251, 'Karin BeeJay XL', '1'),
(252, 'Karin Dilettante', '1'),
(253, 'Karin Dilettante Patrol Vehicle', '1'),
(254, 'Karin Futo', '1'),
(255, 'Karin Intruder', '1'),
(256, 'Karin Kuruma', '1'),
(257, 'Karin Kuruma Armored', '1'),
(258, 'Karin Rebel', '1'),
(259, 'Karin Sultan', '1'),
(260, 'Karin Sultan RS', '1'),
(261, 'Karin Technical', '1'),
(262, 'Karin Technical Aqua', '1'),
(263, 'Karin Technical Custom', '1'),
(264, 'Lampadati Casco', '1'),
(265, 'Lampadati Felon', '1'),
(266, 'Lampadati Felon GT', '1'),
(267, 'Lampadati Furore GT', '1'),
(268, 'Lampadati Michelli GT', '1'),
(269, 'Lampadati Pigalle', '1'),
(270, 'Lampadati Tropos Rallye', '1'),
(271, 'Lampadati Viseris', '1'),
(272, 'LCC	Avarus', '1'),
(273, 'LCC	Hexer', '1'),
(274, 'LCC	Innovation', '1'),
(275, 'LCC	Sanctus', '1'),
(276, 'Maibatsu Manchez', '1'),
(277, 'Maibatsu Mule', '1'),
(278, 'Maibatsu Mule Armored', '1'),
(279, 'Maibatsu Mule Custom', '1'),
(280, 'Maibatsu Penumbra', '1'),
(281, 'Maibatsu Sanchez', '1'),
(282, 'Maibatsu Sanchez w / Livery', '1'),
(283, 'Mammoth	Patriot', '1'),
(284, 'Mammoth	Patriot Stretch', '1'),
(285, 'Mammoth	Thruster Jetpack', '1'),
(286, 'MTL	Brickade', '1'),
(287, 'MTL	Dune', '1'),
(288, 'MTL	Fire Truck', '1'),
(289, 'MTL	Flatbed', '1'),
(290, 'MTL	Packer', '1'),
(291, 'MTL	Pounder', '1'),
(292, 'MTL	Pounder Custom', '1'),
(293, 'MTL	Wastelander', '1'),
(294, 'Nagasaki BF400', '1'),
(295, 'Nagasaki Blazer', '1'),
(296, 'Nagasaki Blazer Aqua', '1'),
(297, 'Nagasaki Blazer Lifeguard', '1'),
(298, 'Nagasaki Caddy', '1'),
(299, 'Nagasaki Bunker Caddy', '1'),
(300, 'Nagasaki Caddy Utility', '1'),
(301, 'Nagasaki Carbon RS', '1'),
(302, 'Nagasaki Chimera', '1'),
(303, 'Nagasaki Hot Rod Blazer', '1'),
(304, 'Nagasaki Shotaro', '1'),
(305, 'Nagasaki Street Blazer', '1'),
(306, 'Obey 9F', '1'),
(307, 'Obey 9F Cabrio', '1'),
(308, 'Obey Omnis', '1'),
(309, 'Obey Rocoto', '1'),
(310, 'Obey Tailgater', '1'),
(311, 'Ocelot Ardent', '1'),
(312, 'Ocelet F620', '1'),
(313, 'Ocelet Jackal', '1'),
(314, 'Ocelet Lynx', '1'),
(315, 'Ocelet Pariah', '1'),
(316, 'Ocelet Penetrator', '1'),
(317, 'Ocelet Stromberg', '1'),
(318, 'Ocelet Swinger', '1'),
(319, 'Ocelet XA - 21', '1'),
(320, 'Overflod Autarch', '1'),
(321, '  Overflod Entity XF', '1'),
(322, '  Overflod Entity XXR', '1'),
(323, '  Overflod Tyrant', '1'),
(324, '  Pegassi Bati 801', '1'),
(325, '  Pegassi Bati 801RR', '1'),
(326, '  Pegassi Esskey', '1'),
(327, '  Pegassi Faggio', '1'),
(328, '  Pegassi Faggio Mod', '1'),
(329, '  Pegassi FCR 1000', '1'),
(330, '  Pegassi FCR 1000 Custom', '1'),
(331, '  Pegassi Infernus', '1'),
(332, '  Pegassi Infernus Classic', '1'),
(333, '  Pegassi Monroe', '1'),
(334, '  Pegassi Oppressor', '1'),
(335, '  Pegassi Oppressor MK II', '1'),
(336, '  Pegassi Osiris', '1'),
(337, '  Pegassi Reaper', '1'),
(338, '  Pegassi Ruffian', '1'),
(339, '  Pegassi Tempesta', '1'),
(340, '  Pegassi Tezeract', '1'),
(341, '  Pegassi Torero', '1'),
(342, '  Pegassi Vacca', '1'),
(343, '  Pegassi Vortex', '1'),
(344, '  Pegassi Zentorno', '1'),
(345, '  Pfister 811', '1'),
(346, '  Pfister Comet', '1'),
(347, '  Pfister Comet Retro Custom', '1'),
(348, '  Pfister Comet Safari', '1'),
(349, '  Pfister Comet SR', '1'),
(350, '  Pfister Neon', '1'),
(351, '  Principe Diabolus', '1'),
(352, '  Principe Diabolus Custom', '1'),
(353, '  Principe Lectro', '1'),
(354, '  Principe Nemesis', '1'),
(355, '  Progen GP1', '1'),
(356, '  Progen Itali GTB', '1'),
(357, '  Progen Itali GTB Custom', '1'),
(358, '  Progen T20', '1'),
(359, '  Progen Tyrus', '1'),
(360, '  RUNE Cheburek', '1'),
(361, '  Schyster Fusilade', '1'),
(362, '  Shitzu Defiler', '1'),
(363, '  Shitzu Hakuchou', '1'),
(364, '  Shitzu Hakuchou Drag Bike', '1'),
(365, '  Shitzu PCJ 600', '1'),
(366, '  Shitzu Vader', '1'),
(367, '  Stanley	Fieldmaster', '1'),
(368, '  Stanley	Tractor', '1'),
(369, '  Truffade Adder', '1'),
(370, '  Truffade Nero', '1'),
(371, '  Truffade Nero Custom', '1'),
(372, '  Truffade Z - Type', '1'),
(373, '  Ubermacht Oracle', '1'),
(374, '  Ubermacht Oracle XS', '1'),
(375, '  Ubermacht Revolter', '1'),
(376, '  Ubermacht SC1', '1'),
(377, '  Ubermacht Sentinel', '1'),
(378, '  Ubermacht Sentinel Classic', '1'),
(379, '  Ubermacht Sentinel XS', '1'),
(380, '  Ubermacht Zion', '1'),
(381, '  Ubermacht Zion Cabrio', '1'),
(382, '  Vapid Benson', '1'),
(383, '  Vapid Blade', '1'),
(384, '  Vapid Bobcat XL', '1'),
(385, '  Vapid Bullet', '1'),
(386, '  Vapid Caracara', '1'),
(387, '  Vapid Chino', '1'),
(388, '  Vapid Chino Custom', '1'),
(389, '  Vapid Clown Van', '1'),
(390, '  Vapid Contender', '1'),
(391, '  Vapid Desert Raid', '1'),
(392, '  Vapid Dominator', '1'),
(393, '  Vapid Dominator GTX', '1'),
(394, '  Vapid Ellie', '1'),
(395, '  Vapid Flash GT', '1'),
(396, '  Vapid FMJ', '1'),
(397, '  Vapid GB200', '1'),
(398, '  Vapid Guardian', '1'),
(399, '  Vapid Hotknife', '1'),
(400, '  Vapid Hustler', '1'),
(401, '  Vapid Minivan', '1'),
(402, '  Vapid Minivan Custom', '1'),
(403, '  Vapid Peyote', '1'),
(404, '  Vapid Pibwasser', '1'),
(405, '  Vapid Police Cruiser', '1'),
(406, '  Vapid Police Interceptor', '1'),
(407, '  Vapid Police Prison Bus', '1'),
(408, '  Vapid Radius', '1'),
(409, '  Vapid Retinue', '1'),
(410, '  Vapid Riata', '1'),
(411, '  Vapid Sadler', '1'),
(412, '  Vapid Sandking SWB', '1'),
(413, '  Vapid Sandking XL', '1'),
(414, '  Vapid Scrap Truck', '1'),
(415, '  Vapid Sheriff Cruiser', '1'),
(416, '  Vapid Slamvan', '1'),
(417, '  Vapid Slamvan Custom', '1'),
(418, '  Vapid Speedo', '1'),
(419, '  Vapid Speedo Custom', '1'),
(420, '  Vapid Stanier', '1'),
(421, '  Vapid Taxi', '1'),
(422, '  Vapid Liberator', '1'),
(423, '  Vapid Tow Truck', '1'),
(424, '  Vapid Large Tow Truck', '1'),
(425, '  Vapid Trophy Truck', '1'),
(426, '  Vapid Unmarked Cruiser', '1'),
(427, '  Vapid Utility Truck', '1'),
(428, '  Vulcar Fagaloa', '1'),
(429, '  Vulcar Ingot', '1'),
(430, '  Vulcar Warrener', '1'),
(431, '  Weeny Issi', '1'),
(432, '  Weeny Issi Classic', '1'),
(433, '  Western Motorcycle Company	Bagger', '1'),
(434, '  Western Motorcycle Company	Cliffhanger', '1'),
(435, '  Western Motorcycle Company	Daemon', '1'),
(436, '  Western Motorcycle Company	Daemon Custom	', '1'),
(437, '  Western Motorcycle Company	Gargoyle', '1'),
(438, '  Western Motorcycle Company	Nightblade', '1'),
(439, '  Western Motorcycle Company	Police Bike', '1'),
(440, '  Western Motorcycle Company	Rat Bike', '1'),
(441, '  Western Motorcycle Company	Sovereign', '1'),
(442, '  Western Motorcycle Company	Wolfsbane', '1'),
(443, '  Western Motorcycle Company	Zombie Bobber	', '1'),
(444, '  Western Motorcycle Company	Zombie Chopper	', '1'),
(445, '  Willard	Faction', '1'),
(446, '  Willard	Faction Custom', '1'),
(447, '  Willard	Faction Custom Donk', '1'),
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
  `status` varchar(255) NOT NULL,
  `officer_name` text NOT NULL
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
-- Table structure for table `10_codes`
--

CREATE TABLE `10_codes` (
  `id` varchar(64) NOT NULL,
  `code` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `what_pages` text,
  `should_do` text,
  `position` int(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `10_codes`
--

INSERT INTO `10_codes` (`id`, `code`, `what_pages`, `color`, `should_do`) VALUES
('ab4f8a59-5485-4995-b800-0a96d6d28fb8', '10-42', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-danger', 'set_off_duty'),
('e431013d-cdff-4d6f-9968-b3963986fb99', '10-7', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('1014d770-5e87-4438-9fcf-a037e82c7ff1', '10-15', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('17a0efa6-d635-4bd9-bafe-0efab8818849', '10-97', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"}]', 'btn-secondary', 'set_status'),
('6c7a2705-58bc-4131-8190-75383c9b6b97', '10-17', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('7c005300-c846-4d17-88fc-6f70840c3e0a', '10-11', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('8bde82d0-2e31-4380-89f7-4be532cf58d9', '10-23', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('9ae5afd5-8219-4108-9e76-26e54bfac1b8', '10-6', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"}]', 'btn-secondary', 'set_status'),
('9dd81d0a-1e1d-48ca-bd69-ce9d6b10855e', '10-5', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"}]', 'btn-secondary', 'set_status'),
('c04f9b07-4c73-46dc-b996-677a3154263a', '10-4', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"},{\"value\":\"ems_fd\",\"label\":\"EMS-FD\"}]', 'btn-secondary', 'set_status'),
('7db84c66-76a5-46fd-bab0-b20e52389271', 'Code 6', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status'),
('cce2f6ec-da78-41fe-a722-ba3db4c6eed5', 'Code 5', '[{\"value\":\"leo\",\"label\":\"LEO\"},{\"value\":\"dispatch\",\"label\":\"Dispatch\"}]', 'btn-secondary', 'set_status');

--
-- Table structure for table `penal_codes`
--

CREATE TABLE `penal_codes` (
  `id` varchar(64) NOT NULL,
  `title` longtext,
  `des` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `penal_codes`
--

INSERT INTO `penal_codes` VALUES ('a0548a4c-6aa2-11eb-b367-6045cb99fe9a','(1)01.Intimidation','1) A person who communicates to another that they will physically harm or kill such other, placing such other in a reasonable state of fear for their own safety — in person, writing, or through media. 2)  A person who communicates that they will physically harm or kill another person’s close friends or relatives — in person, writing, or through media. '),('a055c2d8-6aa2-11eb-b550-6045cb99fe9a','(1)02. Assault','1) A person who intentionally puts another in the reasonable belief of imminent physical harm or offensive contact.\n\n- Penal Code (1)02 is a misdemeanor punishable by imprisonment of no less than 15 minutes and no more than 40 minutes.\n\n NOTES:  Assault is defined by distance the threats occur. Someone a few feet away threatening to harm or kill you at any moment is assault. Intimidation is less severe as there’s a distance that someone can escape through, or that the perpetrator has more time to reconsider the threat.       Any violent physical contact is considered to be battery, however grabbing someone during a threat may be either assault or battery, depending on intention and interpretation.'),('a055c2d9-6aa2-11eb-aeb8-6045cb99fe9a','(1)03. Assault On A Peace Officer','1) A person who attempts to harm or injure a Law Enforcement Officer, while doing their duties.\n\n Penal Code (1)03 is a felony punishable by imprisonment of no less than 40 seconds and no more than 1 hour and 20 seconds.'),('a055e9e8-6aa2-11eb-b870-6045cb99fe9a','(1)04. Assault WIth A Deadly Weapon','1) A person who attempts to harm or injure a Law Enforcement Officer, while doing their duties.\n\n - Penal Code (1)04 is a felony punishable by imprisonment of no less than 60 seconds and no more than 180 seconds.'),('a055e9e9-6aa2-11eb-8f44-6045cb99fe9a','(1)05. Mutual Combat','1) A person who engages in mutual combat with another individual in an area accessible to the public, or in public view, regardless of the consent of the individuals involved. \n\n - Penal Code (1)05 is a misdemeanor punishable by imprisonment of no less than 30 seconds and no more than 60 seconds.'),('a05610f6-6aa2-11eb-a4d3-6045cb99fe9a','(1)06. Battery','1) A person who uses intentional and unlawful force or violence to cause physical harm to another person. \n\n  - Penal Code (1)06 is a misdemeanor punishable by imprisonment of no less than 45 seconds and no more than 75 seconds.'),('a05610f7-6aa2-11eb-ab39-6045cb99fe9a','(1)07. Aggravated Battery','1) A person who uses great or continued force or violence against another person and causes severe harm. \n 2) A person that uses a weapon, tool or other dangerous item to cause severe harm to a person(s). \n\n - Penal Code (1)07 is a felony punishable by imprisonment of no less than 60 minutes and no more than 240 minutes. \n - If a weapon is used and severe harm is inflicted on a person(s), the perpetrator shall receive the maximum sentence. \n\n NOTES: Aggravated Battery is the continued violence or battery against an individual, such as an ongoing fight or brawl, that doesn’t lead to severe bodily harm or life threatening injury.'),('a0563802-6aa2-11eb-9398-6045cb99fe9a','(1)08. Attempted Murder','1) A person who deliberately and intentionally attempts to kill or cause life threatening harm to another person through premeditated actions. \n 2) A person who, by criminal accident, negligence, or in the heat of passion, causes severe or life threatening bodily harm to another person. \n\n - Penal Code (1)08 is a felony punishable by no less than 330 minutes and no more than 510 minutes.\n- If occurring by accident, negligence, or in the heat of passion, the perpetrator shall receive the minimum sentence. \n\n NOTES: Attempted Murder is a catch-all for any action that leads to severe bodily harm. Its range in imprisonment is intended to account for when such severe harm is premeditated or accidental.For accidents and negligence there must be evidence of foul play, criminality in the instance, or some other factor beyond a truly accidental incident. For example, injuring someone while speeding or intoxicated.\n\n((Aggravated Battery is much less severe and would not, for example, leave someone in a coma or brutally wounded script-wise. There is however also no guarantee that being brutally wounded means attempted Murder as it depends on how the situation is RPed. ))'),('a0563803-6aa2-11eb-bbd4-6045cb99fe9a','(1)09. Manslaughter','1) A person who unintentionally kills another, with or without a quarrel or heat of passion. \n 2) A person who, through a criminal accident or negligence, causes someone\'s death. \n\n a) Vehicular Manslaughter - a person who unintentionally kills another with a land, air, and sea vehicles. \n\n- Penal Code (1)09 is a felony punishable by imprisonment of no less than 240 minutes and no more than 360 minutes.\n- If occurring by accident, negligence, or in the heat of passion, the perpetrator shall receive the minimum sentence.\n\n NOTES: Manslaughter is murder that is not premeditated or proven to have intent or an opportunity to pause and reflect on killing that person. An opportunity to reflect (and therefore possibly change your mind) demonstrates premeditation and is murder. Manslaughter is only charged in the penal code when some sort of criminal negligence or action can be proven. Killing someone while driving drunk is manslaughter. Accidentally killing someone who jaywalks outside of a crosswalk is not criminal. '),('a0563804-6aa2-11eb-a7d4-6045cb99fe9a','(1)10. Murder','1) A person who unlawfully kills another with malice aforethought \n 2) A person who commits murder while engaging in a felony offense that has been proven to be a premeditated act. \n\n - Penal Code (1)10 is a felony punishable by no less than 510 minutes imprisonment and no more than 660 minutes imprisonment. \n\n NOTES: Murder is defined clearly by a person’s premeditated forethought or plan to commit the murder. Manslaughter happens in a heat of passion, by criminal negligence or accident, or for some other incident that is not expected. The only exception to this is when someone commits a planned felony, such as planning to commit an arson. If someone dies as a result of the premeditated arson, it is no longer manslaughter and instead murder.'),('a0565f18-6aa2-11eb-b92e-6045cb99fe9a','(1)11. False Imprisonment','1) A person who detains or arrests another without their consent (or the consent of their guardian) without premeditated intent or ransom for less than one hour. \n 2) A person who performs an unlawful citizen’s arrest. \n\n - Penal Code (1)11 is a felony punishable by no less than 120 minutes imprisonment and no more than 270 minutes imprisonment.\n- If committed against a minor the perpetrator is punishable by the maximum sentence. \n\n NOTES: False Imprisonment is when someone is held against their will for less than one hour, without any premeditated intent (such as a plan to kidnap someone) or when there is no intention to ransom the individual.Citizens arrest is a limited tool (defined elsewhere in the penal code) to hold individuals while awaiting police custody. Doing this unlawfully is considered a False Imprisonment.'),('a0565f19-6aa2-11eb-8f6c-6045cb99fe9a','(1)12. Kidnapping','1) A person who detains or arrests another without their consent (or the consent of their guardian) with the premeditated intent to do so. \n 2) A person who detains or arrests another without their consent (or the consent of their guardian) for more than one hour.\n 3) A person who detains or arrests another without their consent (or the consent of their guardian) with the intent or decision to hold that individual for ransom of any kind.\n\n- Penal Code (1)12 is a felony punishable by no less than 270 minutes imprisonment and no more than 420 minutes imprisonment.\n - If committed against a minor the perpetrator is punishable by the maximum sentence. \n\n NOTES: Kidnapping is defined by a more egregious act of False Imprisonment. Kidnapping is when the False Imprisonment is premeditated or planned, done for ransom (any reward or action in return for the person’s safe return,) or for more than one hour, regardless of intent.'),('a0565f1a-6aa2-11eb-b8f8-6045cb99fe9a','(1)13. Mayhem','1) A person who intentionally causes extreme pain and suffering to a person, with or without permanent damage to the body. \n 2) A person who causes pain and suffering for the purpose of revenge, extortion, persuasion, or for any sadistic purpose.\n 3) A person who intentionally disfigures, disables, or aggressively destroys or damages a body part or area of a body or person’s body. \n\n - Penal Code (1)13 is a felony punishable by no less than 300 minutes imprisonment and no more than 450 minutes imprisonment.\n\n NOTES: Mayhem/Torture is in many ways a penal code entry to enhance other charges. Mayhem can be added to any change in an instance where the Mayhem took place while, or along with, the crime being committed. It is not automatically applied to charges that may be considered Mayhem (such as an Arson that leads to Murder) unless there is the demonstration of the perpetrator torturing someone specifically in that act of Arson. Ultimately it is up to the police to use this charge responsibly.'),('a0568622-6aa2-11eb-a955-6045cb99fe9a','(1)14. Vehicular Murder ','1) A person who, while operating a motor vehicle in a severely reckless and deliberate manner, causes someone\'s death. \n 2) A person who while Evading Peace Officers in a motor vehicle, directly or indirectly causes someone\'s death.\n\n - Penal Code (1)14 is a felony punishable by no less than 510 minutes imprisonment and no more than 660 minutes imprisonment.\n- If occurring by accident, negligence, or in the heat of passion, the perpetrator shall receive the minimum sentence.\n\n NOTES: Vehicular Murder is only applicable if the individual driving the vehicle would have been reasonably aware of the fact that their driving, either due to its criminal intent (eluding police) or reckless nature, could feasibly cause great bodily injury or death to someone.'),('a0568623-6aa2-11eb-a592-6045cb99fe9a','(1)15. Racketeering','1) Racketeering is the affiliation or association of an individual with a criminal organization, as prescribed by local or national law enforcement entities, with the evidence of the individual\'s attempts to commit extortion, bribery, murder, or other criminal activities while affiliated with said criminal organization.\n\n- Penal Code (1)15 is a felony punishable by imprisonment of no less than 20 minutes and must be submitted to trial for sentencing.'),('a0568624-6aa2-11eb-be3d-6045cb99fe9a','(2)01. Arson','1) A person who intentionally and maliciously sets fire to or burns any structure, forest land, or property without prior authorization. \n 2) A person who intentionally aids, counsels, or helps facilitate the burning of any structure, forest land, or property without proper authorization.\n 3) A person who, through criminal accident or negligence, causes a fire to burn any structure, forest land, or property.\n\n - Penal Code (2)01 is a felony punishable by no less than 50 minutes and no more than 240 minutes.\n - If occurring by accident or negligence, the perpetrator shall receive the minimum sentence.\n\n NOTES: Arson’s criminality is when someone intentionally creates or helps create a fire, as it can easily grow out of control and cause death. It is up to the Fire Marshal’s Office and investigating Law Enforcement Agency jointly to prove an arson was malicious and therefore criminal. Negligence or accident can be included if it is proven criminal in nature.'),('a056ad3e-6aa2-11eb-8083-6045cb99fe9a','(2)02. Trespassing ','1) A person who enters another’s property while it is closed or not in operation without the expressed or written permission to do so.\n 2) A person who enters the restricted area of an open facility or property as defined and clearly marked by the property manager without the expressed or written permission to do so.\n 3) This cannot stack with (2)03. Trespassing within a Restricted Zone.\n4) This crime cannot stack with any form of Burglary\n\n- Penal Code (2)02 is a misdemeanor punishable by $2,000 AND an imprisonment of 10 minutes. This falls under Officer Discretion.\n\n NOTES: Trespassing refers to anyone who is told to leave and refuses to do so, but lacks any intention of committing a crime or other malice aforethought or action. Burglary is a far more severe act of trespassing as it comes with evidence of criminal intent.\n\n If police close down a public space it is trespassing to enter that public space without their authorization. The same applies if a typically public space is temporarily closed.\n\nOwners of trailers or caravans may only consider their trailer or caravan their own property. The surrounding trailer park is not considered their own property when the area includes several other trailers and caravans that are not owned by one individual.'),('a056ad3f-6aa2-11eb-b60e-6045cb99fe9a','(2)03. Trespassing within a Restricted Zone','1)A person who, without proper authorization, enters any government owned or managed facility, or restricted section in a government building that is secured with the intent of keeping non-authorized personnel out due to a security or safety hazard.\n 2) This charge cannot stack with (2)02. Trespassing \n\n - Penal Code (2)03 is a misdemeanor punishable by no less than 30 minutes imprisonment and no more than 50 minutes imprisonment. This falls under Officer Discretion\n\n NOTES: As an example: areas of a police station that are restricted (i.e. armory, locker rooms, offices), trespassing inside the restricted areas of the Correctional Facility, trespassing inside restricted areas of a hospital (i.e. staff area of the pharmacy, surgery theatres when not permitted).'),('a056ad40-6aa2-11eb-abbd-6045cb99fe9a','(2)04. Burglary','1) A person who enters into the locked or restricted property of another without their permission with the intention of committing a crime, typically theft.\n 2) This crime cannot stack with (2)02. Trespassing.\n\n - Penal Code (2)04 is a misdemeanor punishable by no less than 25 minutes and no more than 55 minutes imprisonment.\n\n NOTES: Burglary can include homes, apartments, offices, vehicles or any locked space with restricted access. Burglary is also committed irrelevant if any theft or other crime takes place. A less severe act of burglary is trespassing, which would account for instances where there is no intent to commit a crime, no locked door or other physical restriction.'),('a056d448-6aa2-11eb-abc8-6045cb99fe9a','(2)05. Possession Of Burglary Tools','1) A person who has in their possession the appropriate combination of tools necessary to commit burglary, such as a tension bar, screwdriver, shimmy, or other appropriate items. \n\n - Penal Code (2)05 is an infraction of $3,000.\n\n NOTES: It must be demonstrated that the person has a certain combination of these tools or in an appropriate context that would assume their usage in burglary. Having a screwdriver is not punishable alone, but a screwdriver, along with a tension bar, is punishable.'),('a057497a-6aa2-11eb-8bc1-6045cb99fe9a','(2)06.Robbery','1) A person who takes property from the possession of another against their will, by means of force or fear, such as through intimidation, assault or battery.\n 2)This charge cannot stack with (2)07. Armed Robbery.\n\n - Penal Code (2)06 is a felony punishable by an addition of 120 minutes imprisonment to any charges associated with the robbery attempt.\n\nNOTES: Robbery stacks with any \"title\" 1 crimes that are attempted during the Robbery. It cannot stack with Armed Robbery, which is when the force, intimidation, or fear involves a dangerous weapon.'),('a0577092-6aa2-11eb-ac45-6045cb99fe9a','(2)07. Armed Robbery','1) A person who takes property from the possession of another against their will, by means of force facilitated with a weapon or with an item used as a weapon.\n 2) This charge cannot stack with (2)06. Robbery.\n\n - Penal Code (2)07 is a felony punishable by an addition of 180 minutes imprisonment to any charges associated with the armed robbery attempt.\n\n NOTES: Armed Robbery stacks with any \"title\" 1 crimes that are attempted during the robbery. It cannot stack with Robbery.'),('a0577093-6aa2-11eb-a9ee-6045cb99fe9a','(2)08. Petty Theft','1) A person who steals or takes the personal property of another worth $2,500 or less.\n\n - Penal Code (2)08 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 40 minutes imprisonment. This falls under Officer Discretion. '),('a0577094-6aa2-11eb-bee0-6045cb99fe9a','(2)09. Theft ','1) A person who steals or takes the personal property of another worth more than $2,500 but less than $10,000.\n\n - Penal Code (2)09 is a misdemeanor punishable by no less than 45 minutes imprisonment and no more than 90 minutes imprisonment. '),('a0577095-6aa2-11eb-9817-6045cb99fe9a','(2)10. Grand Theft','1) A person who steals or takes the personal property of another worth $10,000 or more.\n\n- Penal Code (2)10 is a felony punishable by no less than 180 minutes imprisonment and no more than 270 minutes imprisonment.'),('a0579798-6aa2-11eb-a2b6-6045cb99fe9a','(2)11. Grand Theft Auto','1) A person who commits the theft of any vehicle, no matter the value.\n 2) A person who illegally enters any parked vehicle’s driver seat.\n 3) This charge cannot stack with any form of Trespassing or Burglary.\n\n - Penal Code (2)11 is a felony punishable by no less than 120 minutes imprisonment and no more than 180 minutes imprisonment.\n\nNOTES: Grand Theft Auto does stack with theft, but not burglary or trespassing. '),('a0579799-6aa2-11eb-bafd-6045cb99fe9a','(2)12. Grand Theft Of A Firearm','1) A person who commits theft of any firearm, no matter the value or whether it is registered.\n\n- Penal Code (2)12 is a felony punishable by no less than 180 minutes imprisonment and no more than 240 minutes imprisonment.\n\nNOTES: Grand Theft Of A Firearm does stack with Theft. '),('a057979a-6aa2-11eb-abe2-6045cb99fe9a','(2)13. Receiving Stolen Property','1) A person who knowingly buys or receives any property that has been stolen or that has been obtained in any manner constituting theft or extortion.\n\n - Penal Code (2)13 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 45 minutes imprisonment.\n\n NOTES: If an officer can prove that the individual should have known the item was stolen based on outside factors, such as the price or quality, or any sort of common knowledge, then the person can be charged.'),('a057979b-6aa2-11eb-9948-6045cb99fe9a','(2)14. Extortion','1) A person who intimidates or influences another to provide or hand over properties or services.\n 2)A person who utilizes or threatens their power or authority with demonstrated malice aforethought in order to compel action by another.\n 3) A person who utilizes privileged information to intimidate another for certain property or services.\n\n - Penal Code (2)14 is a felony punishable by no less than 180 minutes imprisonment and no more than 300 minutes imprisonment.\n\n NOTES: Extortion depends on a person or organization using its authority, power, or influence to intimidate and threaten someone in return for property or services. Property may be demanding money to keep quiet or demanding a certain personal payment to prevent a strike.Extortion may serve in lieu of corruption depending on the circumstances, or if it involves a private organization.A union threatening a strike or collective worker action is NOT extortion unless a specific leader or member is being paid to influence union operations.'),('a057beae-6aa2-11eb-b12e-6045cb99fe9a','(2)15. Forgery','1) A person who knowingly alters, creates, or uses a written document with the intent to defraud or deceive another.\n 2) A person who knowingly signs a document or agreement, electronic or otherwise, without the consent or authority of whom they are signing for.\n\n - Penal Code (2)15 is a misdemeanor punishable by no less than 30 minutes imprisonment and no more than 60 minutes imprisonment. '),('a057beaf-6aa2-11eb-9ab0-6045cb99fe9a','(2)16. Fraud','1) A person who intentionally misrepresents a matter of fact - whether by words or by conduct, by false or misleading allegations, or by concealment of what should have been disclosed - that deceives and is intended to deceive another so that such other will act upon it to their disadvantage.\n\n - Penal Code (2)16 is a felony punishable by no less than 60 minutes imprisonment and no more than 150 minutes imprisonment.'),('a0585ae8-6aa2-11eb-9ad8-6045cb99fe9a','(2)17. Vandalism','1) A person that defaces, damages, or destroys property which belongs to another.\n\n- Penal Code (2)17 is a misdemeanor punishable by imprisonment of no less than 10 minutes and no more than 25 minutes. This falls under Officer Discretion. '),('a0585ae9-6aa2-11eb-b035-6045cb99fe9a','(3)01. Lewd Or Dissolute Conduct In Public','1) A person who solicits anyone to engage in inappropriate sexual or sexually suggestive conduct in any public place or in any place open to the public or exposed to public view.\n 2) A person who engages in inappropriate sexual or sexually suggestive conduct in any public place or in any place open to the public or exposed to public view.\n 3) A person who solicits sexual activity in a public place or any place open to public view.\n\n - Penal Code (3)01 is a misdemeanor punishable by no less than 10 minutes imprisonment and no more than 20 minutes imprisonment. This falls under Officer Discretion.\n\n NOTES: Lewd or Dissolute Conduct refers to actions that are not necessarily Indecent Exposure, but can presumably involve or lead to Indecent Exposure. Suggestive actions or gestures in bathroom stalls or other areas that are considered indecent but not naked or involve genitalia is Lewd Or Dissolute Conduct.This also applies for Indecent Exposure in areas like restrooms which involve your genitalia.'),('a0585aea-6aa2-11eb-83b0-6045cb99fe9a','(3)02. Indecent Exposure','1) A person who intentionally exposes their naked body or genitalia on public property or in the public area of a privately owned business.\n 2) A person who intentionally exposes their naked body or genitalia on private property without permission of the property owner.\n 3) A person who engages in sex or other sexual activity in a plia in the view of a minor.\n\n  - Penal Code(3)02 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 40 minutes imprisonment. This falls under Officer Discretion.\n - If committed knowingly in the presence of a minor, the perpetrator shall receive the maximum sentence.\n\n NOTES: Private parties / reservations in public areas are considered public events that can be restricted and therefore permit naked bodies. It is when it is in a public area or exposed to children that it is indecent exposure. Genitalia does not include breasts. Assume below the belt exposure.'),('a0585aeb-6aa2-11eb-b7a8-6045cb99fe9a','(3)03. Prostitution','1) A person who knowingly engages in a sexual act in return for payment, goods, services or other items of value.\n\n - Penal Code (3)03 is a felony punishable by no less than imprisonment for 60 minutes imprisonment and no more than 120 minutes imprisonment.\n\n NOTES: Anyone who cannot be proven to commit prostitution may charged with Indecent Exposure or Lewd or Dissolute Conduct depending on the circumstances.The individual(s) performing the sexual acts in return for money, goods, services or other items of value are to be charged with prostitution'),('a0588200-6aa2-11eb-a5c3-6045cb99fe9a','(3)04. Solicitation of Prostitution','1) A person who offers payment, goods, services or other items of value to an individual in exchange for sexual acts.\n\n - Penal Code (3)04 is a felony punishable by no less than imprisonment for 60 minutes imprisonment and no more than 120 minutes imprisonment.\n\n NOTES: Anyone who cannot be proven to commit prostitution may charged with Indecent Exposure or Lewd or Dissolute Conduct depending on the circumstances. The individual(s) paying another person(s) money, goods, services or other items of value in exchange for a sexual act are to be charged with Solicitation of Prostitution.'),('a0588201-6aa2-11eb-9f25-6045cb99fe9a','(3)05. Pandering - Pimping','1) A person who solicits or advertises, aids or provides transport or supervises persons involved in prostitution and retains some or all of the money earned.\n\n - Penal Code (3)05 is a felony punishable by no less than 90 minutes imprisonment and no more than 180 minutes imprisonment.'),('a0588202-6aa2-11eb-8999-6045cb99fe9a','(3)06. Sexual Assault','1) A person who commits verbal abuse for the purpose of sexual arousal, gratification, or abuse.\n 2) A person who threatens imminent harm or nonconsensual sexual contact or puts another under the belief of imminent harm or nonconsensual sexual contact.\n\n - Penal Code (3)06 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 45 minutes imprisonment.'),('a0588203-6aa2-11eb-b0a9-6045cb99fe9a','(3)07. Sexual Battery','1) A person who commits unwanted touching or sexual contact.\n 2) A person who causes battery or similar aggressive physical contact for the purpose of sexual arousal, gratification, or abuse.\n\n- Penal Code (3)07 is a felony punishable by no less than 270 minutes imprisonment and no more than 300 minutes imprisonment. '),('a058a900-6aa2-11eb-a0ae-6045cb99fe9a','(3)08. Rape','1) A person who forces another to engage in sexual intercourse.\n 2) A person who performs non consensual sexual intercourse with another.\n 3) A person who performs sexual intercourse with another who is incapacitated, disabled, or unable to give consent.\n\n- Penal Code (3)08 is a felony punishable by no less than 360 minutes imprisonment and no more than 720 minutes imprisonment. '),('a058a901-6aa2-11eb-a2db-6045cb99fe9a','(3)09. Statutory Rape','1) A person who engages in mutually-interested sexual intercourse with another who is under the age of 18 and therefore cannot give legal consent.\n\n- Penal Code (3)09 is a felony punishable by no less than 300 minutes imprisonment and no more than 360 minutes imprisonment.'),('a058a902-6aa2-11eb-980a-6045cb99fe9a','(3)10. Stalking','1) A person who intentionally and maliciously follows or harasses another person who has made it known that they do not consent to such following or harassment,\n 2) A person who violates an official restraining order issued by a court.\n\n - Penal Code (3)10 is a felony punishable by no less than 150 minutes imprisonment and no more than 210 minutes imprisonment. \n- If the perpetrator violated a restraining order, they shall receive the maximum sentence.'),('a058d014-6aa2-11eb-b1af-6045cb99fe9a','(4)01. Bribery','1) A person who offers or gives a monetary gift, gratuity, valuable goods, or other reward to a public official, a government employee, or peace officer in an attempt to influence their duties or actions\n 2) A person who gives services or nonmaterial, but valuable actions to a public official, a government employee, or peace officer in an attempt to influence their duties or actions.\n\n - Penal Code (4)01 is a felony punishable by no less than 180 minutes imprisonment and no more than 240 minutes imprisonment.'),('a058d015-6aa2-11eb-9165-6045cb99fe9a','(4)01. Bribery','1) A person who offers or gives a monetary gift, gratuity, valuable goods, or other reward to a public official, a government employee, or peace officer in an attempt to influence their duties or actions\n 2) A person who gives services or nonmaterial, but valuable actions to a public official, a government employee, or peace officer in an attempt to influence their duties or actions.\n\n - Penal Code (4)01 is a felony punishable by no less than 180 minutes imprisonment and no more than 240 minutes imprisonment.'),('a058d016-6aa2-11eb-b5e6-6045cb99fe9a','(4)02. Failure To Pay A Fine','1) A person who fails to pay a fine or court-ordered fee within clearly stated and allotted time period.\n\n -Penal Code (4)02 is a misdemeanor punishable by 15 minutes imprisonment. This falls under Officer Discretion.\n\n NOTES: Arrest warrant applications for this charge can only be filed by the officer who issued the fine the person failed to pay, or by a Sergeant within their department. However, any officer may perform an arrest regardless of whether a warrant has been issued for this charge if they encounter an individual with an unpaid fine.'),('a058f728-6aa2-11eb-b420-6045cb99fe9a','(4)03. Contempt of Court','1) A person who willfully disobeys the verbal or written order of a court authority, disrespects the decorum of the court, or otherwise infringes upon due process.\n 2) This charge can only be issued by a Judge or agent of a court. \n\n- Penal Code (4)03 is a misdemeanor punishable by no less than 15 minutes imprisonment and no more than 240 minutes imprisonment.\n\n NOTES: The Contempt of Court charge is an imprisonment set by a judge relative to a particular court case and the actions committed by the individual disobeying court orders and activities. This is different from (4)04. Subpoena Violation which has to do with official paperwork or documents. '),('a058f729-6aa2-11eb-afae-6045cb99fe9a','(4)04. Subpoena Violation','1) A person who ignores or violates a subpoena order issued by the Courts.\n 2) A person who ignores or violates a request by the courts to be present at a hearing.\n 3) A person who ignores or disobeys an official document issuing orders or actions by a court.\n 4) A person in violation of a court injunction or other government operation.\n\n - Penal Code (4)04 is a misdemeanor punishable by 30 minutes imprisonment.'),('a058f72a-6aa2-11eb-882f-6045cb99fe9a','(4)05. Dissuading A Witness Or Victim','1) A person who knowingly and maliciously prevents or encourages any witness or victim from attending or giving testimony at any trial, proceeding, or inquiry authorized by law with the use of bribery, fear, or other tactics.\n 2) A person who prevents the distribution, completion, answering, or due process of an affidavit or other legal statement.\n\n - Penal Code (4)05 is a felony punishable by no less than 210 minutes imprisonment and no more than 300 minutes imprisonment.'),('a058f72b-6aa2-11eb-ade8-6045cb99fe9a','(4)06. False Information To A Government Employee','1) A person who provides false information or details to a police officer during the course of a criminal investigation or lawful detainment.\n 2) A person who provides knowingly inaccurate data to a government employee investigating in some official capacity.\n 3) This charge also covers when a civilian files a false Police report against another person(s).\n 4) This charge cannot stack with __(4)08. Perjury.__\n\n - Penal Code (4)06 is a misdemeanor punishable by no less than 35 minutes imprisonment and no more than 45 minutes imprisonment. This falls under Officer Discretion.'),('a0591e34-6aa2-11eb-9350-6045cb99fe9a','(4)07. Filing A False Complaint','1) A person who knowingly files a false complaint, statement, document, or representation with any organization regarding the conduct, job performance, or behavior of a public official or employee for the purpose of initiating false administrative action against that official.\n\n - Penal Code (4)07 is a misdemeanor punishable by imprisonment of no less than 25 minutes and no more than 35 minutes. This falls under Officer Discretion.'),('a0591e35-6aa2-11eb-8bc1-6045cb99fe9a','(4)08. Perjury','1) A person who knowingly provides false information while under oath in a court of law\n 2) A person who knowingly provides false information as part of an affidavit, testimony, court-ordered deposition, or document with a statement signifying its authenticity under penalty of perjury.\n3) This charge cannot stack with __(4)06. False Information To A Government Employee.__\n\n- Penal Code (4)08 is a felony punishable by no less than 90 minutes imprisonment and no more than 120 minutes imprisonment. '),('a0591e36-6aa2-11eb-ba72-6045cb99fe9a','(4)09. Failure To Identify To A Peace Officer','1) A person who, while being detained or under arrest by a peace officer, fails to provide a peace officer or other legal authority their name as it appears on an I.D. card or other identifiable information for MDC purposes.\n\n - Penal Code (4)09 is a misdemeanor punishable by no less than 10 minutes and no more than 15 minutes imprisonment. This falls under Office Discretion.\n\n  NOTES:As per (12)11. Maximum Imprisonment someone who fails to identify and provide a way to properly charge them will be imprisoned 900 minutes until they identify themselves, after which this charge, plus all applicable charges, can be placed on their record and their sentence adjusted.'),('a0594548-6aa2-11eb-adb8-6045cb99fe9a','(4)10. Impersonation Of A Government Employee','1) A person who pretends or implies the role of a government worker, such as a peace officer, paramedic, tax collector, federal investigator, or other official.\nA person who wears an official or realistic government employee uniform with an official or realistic badge or identification tag except on an official, legally sanctioned movie or production set.\nA person who claims to be a government worker in order to deceive or take advantage of another individual or organization.\n\n  - Penal Code (4)10 is a misdemeanor punishable by no less than 75 minutes imprisonment and no more than 95 minutes imprisonment. '),('a0594549-6aa2-11eb-af49-6045cb99fe9a','(4)11. Impersonation of an Individual','1) A person who pretends or implies the role of another individual. \n - Penal Code (4)11 is a misdemeanor punishable by no less than 60 minutes imprisonment and no more than 75 minutes imprisonment. '),('a059454a-6aa2-11eb-ba44-6045cb99fe9a','(4)12. Obstruction Of A Government Employee','1) A person who shows a clear and motivated attempt to prevent a government employee from conducting their duties.\n 2) A person who fails to comply with an officer\'s lawful orders.\n 3) A person who, after being issued a ticket, citation, or infraction, continues to violate such law and ignore an officer’s orders.\n 4) A person who enters a crime scene after being told to stop and turn away by a Peace Officer.\n\n- Penal Code (4)11 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 30 minutes imprisonment.\n\n NOTES: A government employee would need to contact a peace officer to get the charge of Obstruction issued. '),('a059454b-6aa2-11eb-ba7e-6045cb99fe9a','(4)13. Resisting A Peace Officer','1) A person who avoids apprehension from an officer by non-vehicular means or resists apprehension by any physical means.\n 2) This charge does not include the attempt to flee and evade by vehicular means, which is (8)02. Evading a Peace Officer.\n\n- Penal Code (4)12 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 45 minutes imprisonment. This falls under Officer Discretion. '),('a059e18a-6aa2-11eb-8433-6045cb99fe9a','(4)14. Escape From Custody','1) A person who has been physically detained by use of restraints or physical force by a peace officer and escapes from said Peace Officer’s personal custody, resulting in a warrant or APB being needed to apprehend the suspect.\n 2) Until a warrant or APB is placed, this incident is classified as (4)12. Resisting a Peace Officer.\n 3) (( If a person quits during an arrest, they may be charged with Escape From Custody at admin discretion. ))\n\n- Penal Code (4)13 is a felony punishable by 100 minutes imprisonment in addition to any outstanding charges on an individual who commits an escape.'),('a059e18b-6aa2-11eb-923e-6045cb99fe9a','(4)15. Escape','1) Any person arrested, booked, charged, or convicted of any crime who thereafter escapes from a county or city jail, prison, community service, or custody of a Correctional or Parole Officer.\n\n - Penal Code (4)14 is a felony punishable by an additional 240 minutes imprisonment to any outstanding charges on an individual who commits an escape.'),('a05a0894-6aa2-11eb-9601-6045cb99fe9a','(4)16. Prisoner Breakout','1) A person who directly aids or assists an inmate with escaping from the law, including the lawful custody of a peace officer, prisoner transport, parole, community service, or incarceration in a county jail or state prison.\n A person who provides information or insights that subsequently assist an inmate with escaping from the law.\n\n - Penal Code (4)15 is a felony punishable by 180 minutes imprisonment.'),('a05a0895-6aa2-11eb-b2a8-6045cb99fe9a','(4)17. Human Trafficking','1) A person who intentionally smuggles non-citizens into the state without proper visas and authorization.\n 2) A person who intentionally restricts another’s liberty with intent for forced labor or sex trafficking, or other forced activities.\n 3)This charge does not stack with __(1)10. Kidnapping__ \n\n - Penal Code (4)16 is a felony punishable by no less than 300 minutes imprisonment and no more than 360 minutes imprisonment.'),('a05a0896-6aa2-11eb-89cb-6045cb99fe9a','(4)18. Misuse Of A Government Hotline','1) A person who uses an emergency government hotline for any purpose other than an emergency situation which involves a life-or-death request for assistance or other purposes dictated by the hotline managers.\n 2) A person who uses any non-emergency or public hotline for purposes irrelevant to that particular government office, department, or agency.\n 3)A person who performs prank calls, fake calls, or tries to incite mayhem through public government lines\n\n  - Penal Code (4)17 is a misdemeanor punishable by no less than 10 minutes imprisonment and no more than 20 minutes imprisonment. This falls under Officer Discretion.'),('a05a0897-6aa2-11eb-b799-6045cb99fe9a','(4)19. Tampering With Evidence','1) A person who destroys or attempts to destroy, conceal, or alter any evidence that can later potentially be used in a criminal investigation or court proceeding.\n\n - Penal Code (4)18 is a felony punishable by no less than 120 minutes imprisonment and no more than 180 minutes imprisonment.'),('a05a2fb0-6aa2-11eb-b5f3-6045cb99fe9a','(4)20. Introduction Of Contraband','1) A person who provides contraband to an inmate of a correctional facility, or attempts to enter a facility with the intent to illegally transport contraband within it.\n\n - Penal Code (4)19 is a felony punishable by no less than 100 minutes imprisonment and no more than 150 minutes imprisonment.'),('a05a2fb1-6aa2-11eb-b5be-6045cb99fe9a','(4)21. Violation Of Parole Or Probation','1) A person who willfully violates the terms of a probation or parole agreement.\n\n - Penal Code (4)20 is a felony punishable by an extension of 180 minutes imprisonment in addition to the inmate’s current sentence. This falls under discretion of the parole officer.'),('a05a2fb2-6aa2-11eb-aeb3-6045cb99fe9a','(4)22. Voter Fraud - Voter Pandering','1) An individual who dissuades or influences official voting outcomes through illicit, illegal, or unethical manners.\n\n - Penal Code (4)21 is a felony punishable by no less than 60 minutes imprisonment and no more than 120 minutes imprisonment.'),('a05a56b4-6aa2-11eb-8253-6045cb99fe9a','(4)23. Corruption Of Public Duty','1) A government employee who acts outside the interests of the public good or public justice.\n 2) A government employee who demonstrates criminal negligence in their duties.\n 3) A government employee convicted by the Department of Justice for committing a felony while on duty. \n\n - Penal Code (4)22 is a felony punishable by no less than 240 minutes imprisonment and no more than 300 minutes imprisonment.'),('a05a56b5-6aa2-11eb-9267-6045cb99fe9a','(4)24. Corruption Of Public Office','1) A person who acts outside the interests of the public good, public justice, or duties of those in public office.\n\n - Penal Code (4)23 is a felony punishable by no less than 300 minutes imprisonment and no more than 360 minutes imprisonment.'),('a05a56b6-6aa2-11eb-bf46-6045cb99fe9a','(4)25. Contempt of Senate','1) A person who willfully disobeys the verbal or written order of the Senate, disrespects the decorum of the Senate, or otherwise infringes upon any senate process.\n 2) This charge can only be issued by Senator or Judge.\n\n - Penal Code (4)24 is a misdemeanor punishable by no less than 15 minutes imprisonment and no more than 240 minutes imprisonment.\n\n NOTES: Decorum would mean internationally or unintentionally interrupting or making any loud noise while the Senate is in process.'),('a05a56b7-6aa2-11eb-9e60-6045cb99fe9a','(5)01. Disturbing The Peace','1) A person who creates a dangerous or intimidating situation in a public place or in the public area of private property.\n 2) A person who attempts to provoke, incite, or promote harm to another person through gestures, language, claims, actions, or other methods.\n 3) A person whose profanity, language, voice, or noise reasonably disturbs nearby civilians or intends to incite violence.\n\n - Penal Code (5)01 is a misdemeanor punishable by no less than 15 minutes imprisonment and no more than 25 minutes imprisonment. This falls under Officer Discretion.'),('a05a7dc2-6aa2-11eb-a229-6045cb99fe9a','(5)02. Unlawful Assembly','1) A person who refuses to leave public property after being ordered to do so by its state agency property manager or a peace officer.\n 2) A person who refuses to leave the scene of a crime or other area after being ordered to so whose presence could hinder police operations.\n 3) A group that fails to protest or demonstrate peacefully in a designated “free speech zone” or without proper permits or authorization from the city.\n 4) A person who refuses to leave private property they were invited to access after being instructed to do so by the property owner or manager.\n  5) This charge cannot stack with Trespassing of any kind.\n\n - Penal Code (5)02 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 35 minutes imprisonment. This falls under Officer Discretion.'),('a05a7dc3-6aa2-11eb-9f7f-6045cb99fe9a','(5)03. Incitement To Riot','1) A person whose actions deliberately agitates or intends to agitate a crowd or large group of people organized or located peacefully in a public or private area in order to promote acts of violence or civil unrest.\n 2) A group of people who could be reasonably identified by a peace officer to be gang members whose actions in a public area intend to incite violence, encourage mayhem, or promote civil unrest.\n\n - Penal Code (5)03 is a felony punishable by no less than 120 minutes imprisonment and no more than 150 minutes imprisonment. This falls under Officer Discretion.'),('a05a7dc4-6aa2-11eb-bfff-6045cb99fe9a','(5)04. Vigilantism','1) A person who attempts to effect justice according to their own understanding of right and wrong, or an unauthorized person attempts to enforce the law. A citizen\'s arrest may only be effected when a civilian, out of fear for their own safety or the safety of their close friends or relatives, subdues or detains another who is violating the law.\n 2) A person who violates (12)10. Good Samaritan Clause. \n\n - Penal Code (5)04 is a felony punishable by no less than 90 minutes imprisonment and no more than 120 minutes imprisonment.\n\n NOTES: Vigilantism does not apply when a law enforcement officer in the vicinity is in need of immediate assistance, and a civilian aids such officer - for example, helping an officer apprehend an unarmed resisting suspect by holding him down.'),('a05aa4d4-6aa2-11eb-ba46-6045cb99fe9a','(5)05. Terrorism','1) A person who, uses systematic threats or actions against the public good to cause fear and intimidation at a grand scale.\n 2) A person who commits an attack or threatens an attack on a major public or private facility, such as a office complex, stadium, public transportation system, bridge, or other such structure.\n 3)This charge can only be issued at the order of the Governor or Chief Justice.\n\n - Penal Code (5)05 is a felony punishable 900 minutes imprisonment.\n\n NOTES: (( This charge requires an in-game lead admin (level 4+) or higher to be approved in lieu of the Governor or Chief Justice ICly. )) '),('a05aa4d5-6aa2-11eb-b8e0-6045cb99fe9a','(6)01. Possession Of A Controlled Substance','1) A person who possesses any controlled substance, except when the substance has been lawfully prescribed to them by a licensed practitioner of medicine or is legally available without a prescription.\n\n - Penal Code (6)01 is a misdemeanor punishable by imprisonment of no less than 15 minutes and no more than 20 minutes. This falls under Officer Discretion.\n- See __(6)11 Possession of Marijuana__, for conditions concerning Marijuana. '),('a05aa4d6-6aa2-11eb-b610-6045cb99fe9a','(6)02. Possession Of A Controlled Substance With Intent To Sell','1) A person in possession of a controlled substance or multiple controlled substances in an amount of over one ounce (28 grams).\n\n - Penal Code (6)02 is a felony punishable by 30 seconds for every half-ounce (14 grams) of total controlled substances in possession upon arrest up to 600 minutes. Total possession is rounded up to the nearest half-ounce if the perpetrator has more than 28 grams.\n\n NOTES: At 28 grams or higher add 30 minutes for every 14 grams in total possession. If the perpetrator has, for example, 60 grams, which is 2 ounces and 4 grams, charge them with 150 minutes, which is four half-ounce increments of 30 minutes (56 grams) and rounded up for the last half ounce (the next 14 grams or less.)\n\n (( Each drug (xx/xx) within inventory is considered 1 gram. ))'),('a05aa4d7-6aa2-11eb-9b02-6045cb99fe9a','(6)03. Possession Of Drug Paraphernalia','1) A person who willingly possesses a device or mechanism used exclusively for the processing or consumption of an illegal controlled substance.\n\n - Penal Code (6)04 is a felony punishable by no less than 45 seconds imprisonment and no more than 60 seconds imprisonment.'),('a05acbe2-6aa2-11eb-ab5b-6045cb99fe9a','(6)04. Maintaining A Place For The Purpose Of Distribution','1) A person who opens or maintains any property for the purpose of unlawfully selling, giving away, storing, or using any controlled substance, firearm, or other illicit device, good, or service.\n\n - Penal Code (6)04 is a felony punishable by no less than 45 seconds imprisonment and no more than 60 seconds imprisonment.'),('a05acbe3-6aa2-11eb-af8a-6045cb99fe9a','(6)05. Manufacture Of A Controlled Substance','1) A person who, except as otherwise provided by law, manufactures, compounds, converts, produces, or prepares, either directly or indirectly by chemical or natural extraction, any illegal substance.\n\n - Penal Code (6)05 is a felony punishable by no less than 120 minutes imprisonment and no more than 180 minutes imprisonment'),('a05acbe4-6aa2-11eb-b28b-6045cb99fe9a','(6)06. Sale Of A Controlled Substance','1) A person who sells, or offers to sell a controlled substance to another person, regardless of whether or not they possess that controlled substance.\n\n - Penal Code (6)06 is a felony punishable by no less than 90 minutes imprisonment and no more than 120 minutes imprisonment.\n\n NOTES: Since it’s irrelevant of possession, this charge can indeed stack with whatever the present possession of a drug is on someone if they are in fact also in illegal possession of a controlled substance. This means anyone caught selling a controlled substance is also charged with whatever possessions they currently have too.'),('a05af2f4-6aa2-11eb-8c9e-6045cb99fe9a','(6)07. Possession Of An Open Container','1) A person who possesses a visible and open container of alcohol in a public place or in a motor vehicle.\n\n- Penal Code (6)07 is an infraction of $1,000.'),('a05af2f5-6aa2-11eb-901a-6045cb99fe9a','(6)08. Public Intoxication','1) A person who is found in any public place under the influence of intoxicating liquor.\n\n - Penal Code (6)08 is a misdemeanor punishable by imprisonment for no less than 10 minutes and no more than 25 minutes. This falls under Officer Discretion.'),('a05af2f6-6aa2-11eb-ba7d-6045cb99fe9a','(6)09. Under The Influence Of A Controlled Substance','1) A person who uses or is under the influence of a controlled substance or dangerous substance without the proper permits or prescription to use such a substance.\n A person can only be charged with this statute for consumption of marijuana if they commit other crimes under the influence of marijuana, or if they are found to be under the influence of marijuana in public, or both.\n\n - Penal Code (6)09 is a misdemeanor punishable by imprisonment for no less than 25 minutes and no more than 35 minutes. This falls under Officer Discretion.'),('a05af2f7-6aa2-11eb-a6b4-6045cb99fe9a','(6)10. Facial Obstruction While Committing A Crime','1) A person who wears a mask, hood, or facial obstruction to conceal their identity in any public place that refuses to remove the obstruction upon order of a peace officer. This does not apply to individuals wearing traditional holiday costumes, or individuals wearing protective facial equipment for professional trades or employment.\n 2) A person who wears a mask, hood, or facial obstruction while committing a crime, regardless of the purpose of the obstruction.\n\n- Penal Code (6)10 is a misdemeanor punishable by 10 minutes imprisonment. This falls under Officer Discretion.'),('a05b8f34-6aa2-11eb-88f9-6045cb99fe9a','(6)11. Possession of Marijuana','1)A person who is found to be in possession of Marijuana shall be charged with one of the three offences depending on the amount listed below:\n 2) 6.0 grams or less - (6)12 Possession of Marijuana\n 3) Between 7.0 grams to 27.0 grams - (6)01 Possession of a Controlled Substance.\n 4) 28.0 grams and more - (6)02 Possession of a Controlled Substance with Intent to Sell.\n\n - Penal Code (6)11 is an infraction of $1,000 for possession of up to 3.0g of marijuana, $2,000 for possession of amounts greater than 3.0g but less than or equal to 5.0g, and $3,000 for possession of amounts greater than 5.0g but less than or equal to 6.0g.'),('a05b8f35-6aa2-11eb-9027-6045cb99fe9a','(7)01. Animal Abuse - Cruelty','1) A person who intentionally maims, mutilates, tortures, wounds, or kills a living animal.\n 2) A person whose neglect maims, mutilates, tortures, wounds, or kills a living animal.\n 3) A person who owns a pet or animal that is not reasonably considered domesticated, safe, or healthy for the animal or the owner, without a proper permit.\n\n - Penal Code (7)01 is a felony punishable by no less than 80 minutes imprisonment and no more than 150 minutes imprisonment.\n  - If the act of abuse was due to neglect or the result of an accident caused by neglect or ignorance the offender shall receive the minimum sentence.\n - If the animal was a police-trained animal during active duty, whether or not intentional, the offender shall receive the maximum sentence.'),('a05bb640-6aa2-11eb-a9e5-6045cb99fe9a','(7)02. Child Abuse','1) A person who willfully inflicts any cruel, excessive, or inhuman corporal punishment upon a child under 18 years of age.\n2) A person who willfully inflicts an injury to a child under 18 years of age, resulting in traumatic harm.\n 3) A person who causes traumatic injury to a child under 18 years of age due to their negligence.\n\n - Penal Code (7)02 is a felony punishable by no less than 360 minutes imprisonment and no more than 720 minutes imprisonment.\n- If the act was caused by negligence the individual shall receive the minimum sentence.'),('a05bb641-6aa2-11eb-8506-6045cb99fe9a','(7)03. Sale of Alcohol To A Minor','1) A person who willfully and knowingly sells alcohol to a minor under the age of 21.\n\n - Penal Code (7)03 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 35 minutes imprisonment.'),('a05bb642-6aa2-11eb-8088-6045cb99fe9a','(7)04. Minor Alcohol Violation','1) A minor under the age of 21 who is in possession of alcohol for consumption, products for consumption containing alcohol, or appears to be under the influence of alcohol.\n\n - Penal Code (7)04 is an infraction punishable by a fine of $1,500 and sending of the minor to their parent\'s or guardian\'s home.'),('a05bb643-6aa2-11eb-9fd6-6045cb99fe9a','(7)05. Possession Of Child Pornography','1) Every person who knowingly possesses imagery, film, video, storage devices that hold content of a person under the age of 18 engaging or simulating sexual conduct.\n\n - Penal Code (7)05 is a felony punishable by 180 minutes imprisonment.'),('a05bdd4c-6aa2-11eb-af32-6045cb99fe9a','(8)00. Limitations','1) All Vehicle Offenses under \"title\" 8 have a policy of being charged once for each vehicle a person uses or effects for each road law incident that takes place. Please see Penal Code (11)00 for details on the definition of a road law incident. Please also note that these charges, while considered an extension of the policies and procedures for \"title\" 11. Road Law, do not adhere to the limitations in times or fines under \"title\" 11. Road Law.\n 2) (8)08. Hit and Run can be charged for each vehicle that a driver or pedestrian commits hit and run upon. All other charges in \"title\" 8 are charged for each vehicle the perpetrator commits the violation within. Changing vehicles during a pursuit for example can lead to two charges of (8)02. Evading a Peace Officer, etc. '),('a05bdd4d-6aa2-11eb-9006-6045cb99fe9a','(8)01. Driving With A Suspended License','1) A person who drives a vehicle, whether on land, sea, or in air, while having a suspended license or authorization.\n\n- Penal Code (8)01 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 25 minutes imprisonment.\n\n NOTES: (( A suspended license expires after the end of the suspension period set by the peace officer, whether or not the individual has a scripted drivers license. )) '),('a05bdd4e-6aa2-11eb-938f-6045cb99fe9a','(8)02. Driving Without A License','1) A person who drives a motor vehicle without a valid license is guilty of this crime under this section. \n 2) Any resident of San Andreas must have a valid driver’s license issued by the State of San Andreas.\n\n • Exception: A person who has been a resident for under 10 days and has a valid driver’s license in any state need not have a San Andreas Drivers License.\n • Exception: Any resident operating a motor vehicle properly registered to the federal government who is authorized by the federal government to operate that vehicle.\n\n -Violations of Penal Code (8)02 are a misdemeanor punishable by a $1000 fine. A vehicle that is being driven by someone without a valid driver’s license may be impounded. '),('a05c045e-6aa2-11eb-9f84-6045cb99fe9a','(8)02.Evading-A-Peace-Officer','1) A person who, while operating or being in a vehicle on land, or while operating a bicycle, willfully flees or otherwise attempts to evade or avoid a pursuing peace officer who communicates visually or audibly their request to pull over or stop.\n\n - Penal Code (8)02 is a felony punishable by 120 minutes imprisonment, and suspension of driver\'s license for between twelve (12) and forty-eight (48) hours at the officer’s discretion.\n\n NOTES: This charge does not include the attempt to flee and evade by foot, which is (4)12. Resisting a Peace Officer.'),('a05c045f-6aa2-11eb-ac17-6045cb99fe9a','(8)03. Evading A Peace Officer — High Performance Vehicle','1) A person who, while operating or being in a high performance land vehicle, willfully flees or otherwise attempts to evade or avoid a pursuing peace officer who communicates visually or audibly their request to pull over or stop.\n\n - Penal Code (8)03 is a felony punishable by 240 minutes imprisonment, and revocation of driver\'s license.\n\n NOTES: - This charge does not include the attempt to flee and evade by foot, which is (4)12. Resisting a Peace Officer.\n\n - High Performance Vehicles Include: Buffalo, Comet, Turismo, Bullet, Cheetah, Infernus, Banshee, ZR-350, Super GT, Phoenix, Jester, Elegy, FCR-900'),('a05c0460-6aa2-11eb-8eca-6045cb99fe9a','(8)04. Evading A Peace Officer — Oversized Vehicle','1) A person who, while operating or being in an oversized land vehicle, willfully flees or otherwise attempts to evade or avoid a pursuing peace officer who communicates visually or audibly their request to pull over or stop.\n\n - Penal Code (8)04 is a felony punishable by 240 minutes imprisonment, and revocation of driver\'s license.\n\n NOTES: - This charge does not include the attempt to flee and evade by foot, which is (4)12. Resisting a Peace Officer.\n\n -Oversized Vehicles Include: Linerunner, Roadtrain, Trashmaster, Bus, Coach, Packers, Flatbed, Combine Harvester'),('a05c0461-6aa2-11eb-aa10-6045cb99fe9a','(8)05. Evading A Peace Officer — Naval Vessel','1) A person who, while operating or being in a naval vessel, willfully flees or otherwise attempts to evade or avoid a pursuing peace officer who communicates visually or audibly their request to stop.\n\n - Penal Code (8)05 is a felony punishable by 120 minutes imprisonment.\n\n NOTES: This charge does not include the attempt to flee and evade by foot, which is (4)12. Resisting a Peace Officer.'),('a05c2b74-6aa2-11eb-9d26-6045cb99fe9a','(8)06. Evading A Peace Officer — Aircraft','1) A person who, while operating or being in an aircraft, willfully flees or otherwise attempts to evade or avoid a pursuing peace officer who communicates visually or audibly their request to land or stop.\n\n - Penal Code (8)06 is a felony punishable by 240 minutes imprisonment.\n\n NOTES: - This charge does not include the attempt to flee and evade by foot, which is (4)12. Resisting a Peace Officer.'),('a05c2b75-6aa2-11eb-bbaa-6045cb99fe9a','(8)07. Flying Without A Pilot\'s License','1) A person operating an aircraft without a proper license or authorization.\n\n- Penal Code (8)07 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 35 minutes imprisonment.'),('a05c2b76-6aa2-11eb-a8a6-6045cb99fe9a','(8)08. Hit And Run','1) A person who hits another person or occupied vehicle and leaves the scene of the accident.\n 2) A person involved in the accident who after being requested by another party involved in the accident fails to disclose their name, provide their license for observation for the purpose of identifying such person, or provides false and misleading information.\n\n - Penal Code (8)08 is a felony punishable by 180 minutes of imprisonment.\n\n  NOTES: This charge can be applied for each instance of hit and run occurring over the course of a road law incident.'),('a05c2b77-6aa2-11eb-b012-6045cb99fe9a','(8)09. Hit And Run Involving Property Damage','1) A person who hits another person\'s personal property and leaves the scene of the accident.\n\n - Penal Code (8)09 is a felony punishable by 100 minutes of imprisonment. '),('a05c5286-6aa2-11eb-8aad-6045cb99fe9a','(8)10. Reckless Operation Of An Aircraft','1) A person who demonstrates careless or general disregard for the safety of themselves or others while operating an aircraft.\n2) A person who performs stunts or dangerous aeronautical maneuvers while over populated areas or while dangerously close to other aircraft.\n3) A person who fails to give appropriate distance or clearance to another aircraft in operation.\n\n - Penal Code (8)10 is a felony punishable by 90 minutes imprisonment, as well as revocation of the person’s license to fly.'),('a05c5287-6aa2-11eb-af2c-6045cb99fe9a','(8)11. Reckless Operation Of An Off-Road Or Naval Vehicle','1) A person who demonstrates careless or general disregard for the safety of themselves or others while operating a naval vehicle or vehicle intended for off-road travel.\n\n - Penal Code (8)11 is a misdemeanor punishable by no less than 35 minutes imprisonment and no more than 45 minutes imprisonment.\n - Officer may at their discretion either revoke the user\'s license or permit, or suspend said license or permit for twelve (12) hours.'),('a05c5288-6aa2-11eb-86b5-6045cb99fe9a','(8)12. Failure To Adhere To ATC Protocols','1) A person who fails to respond to identification requests from nearby aircraft or Air Traffic Control.\n\n - Penal Code (8)12 is a felony punishable by 180 seconds imprisonment.\n - Individuals who do not respond to ATC traffic may become a target of the San Andreas National Guard and be shot down.'),('a05c5289-6aa2-11eb-90c1-6045cb99fe9a','(8)13. Failure To Adhere To Flight Protocols','1) A person who fails to follow the flight protocols as detailed in Section 3. of the State Aviation Act Of 2015.\n\n - Penal Code (8)13 is a felony punishable by 45 seconds imprisonment.\n\n - Individuals who do not respond to ATC traffic may become a target of the San Andreas National Guard and be shot down.'),('a05c79a8-6aa2-11eb-b9e9-6045cb99fe9a','(8)14. Restricted Airspace Violation','1) A person who enters the restricted airspace as detailed in Section 4 of the State Aviation Act Of 2015 and refuses to leave such airspace after being ordered to leave such airspace.\n\n - Penal Code (8)14 is a felony punishable by 180 seconds imprisonment.\n - Individuals who do not respond to ATC traffic or continually evade may become a target of the San Andreas National Guard and be shot down.      '),('a05c79a9-6aa2-11eb-b833-6045cb99fe9a','(9)01. Possession Of An Illegal Blade','1) A civilian who possesses a blade or improvised blade over three inches in length that can be used as a cutting, slashing or stabbing weapon, whether or not concealed.\n\n - Penal Code (9)01 is a misdemeanor punishable by imprisonment of no less than 15 minutes and no more than 25 minutes. This falls under Officer Discretion.\n\n NOTES: (( Any wieldable script-wise knife or katana in your inventory is considered long enough to kill someone and qualify as an illegal blade. ))'),('a05c79aa-6aa2-11eb-ae15-6045cb99fe9a','(9)02. Possession Of An Unlicensed Firearm','1) A civilian who carries a legal, but unlicensed weapon on their person, in their vehicle, place of business, or other facility without proper permits.\n 2) A person who knowingly and willingly allows another person to carry a weapon on their person, in their vehicle, place of business, or other facility without proper permits.\n\n - Penal Code (9)02 is a misdemeanor punishable by no less than 30 minutes imprisonment and no more than 45 minutes imprisonment.\n-If the individual has a felony on record, they shall receive the maximum sentence.\n\n NOTES: Unlicensed weapons include the Colt 45, Desert Eagle, Country Rifle, Shotgun or any other weapons that someone can obtain a license to use, but owns in this specific instance as unlicensed weapons. Illegal firearms are in contrast weapons that are never legal to own, such as UZIs. Assault weapons are AK-47s, etc.  '),('a05ca0a4-6aa2-11eb-8171-6045cb99fe9a','(9)03. Possession Of An Illegal Firearm','1) A civilian who possesses any firearm that is illegal in possession or not considered part of any legal weapon type.\n 2) A person who possesses a firearm that contains illegal modifications in its design including, but not limited to, fully automatic firearms, magazine extensions, and silencers.\n\n - Penal Code (9)03 is a felony punishable by no less than 120 minutes imprisonment and no more than 180 minutes imprisonment.\n\n NOTES: (( Script-wise this includes Silenced Pistols, TEC-9s, MP5s and UZIs, regardless of skinning or IC interpretations. ))'),('a05ca0a5-6aa2-11eb-a5f8-6045cb99fe9a','(9)04. Possession Of An Assault Weapon','1) A civilian who possesses an illegal firearm which uses high-velocity, high-caliber, or specialized ammunition including, but not limited to, FMJ ammunition or HEIAP bullets.\n\n - Penal Code (9)04 is a felony punishable by no less than 180 minutes imprisonment and no more than 240 minutes imprisonment.\n\nNOTES: (( Script-wise this includes AK-47s, M4s, sniper rifles and automatic shotguns, regardless of skinning or IC interpretations. ))'),('a05d3cec-6aa2-11eb-a1ef-6045cb99fe9a','(9)05. Unlicensed Distribution Of A Weapon','1) A person who participates in the illegal distribution of any weapon defined under \"title\" 9 without proper permits or authorization.\n 2) A person who offers to sell any weapon defined under \"title\" 9 without proper permits or authorization. \n\n- Penal Code (9)05 is a felony punishable by no less than 240 minutes imprisonment and no more than 360 minutes imprisonment.\n\n NOTES: (( This charge is for the distribution of any weapon considered illegal in other charges. Scriptwise batons, canes, bats and golf clubs are still legal to distribute. ))'),('a05d63f6-6aa2-11eb-85f6-6045cb99fe9a','(9)06. Possession Of An Explosive Device','1) A person who participates in the illegal distribution of any weapon defined under \"title\" 9 without proper permits or authorization.\n 2) A person who offers to sell any weapon defined under \"title\" 9 without proper permits or authorization. \n\n- Penal Code (9)05 is a felony punishable by no less than 240 minutes imprisonment and no more than 360 minutes imprisonment.\n\n NOTES: (( This charge is for the distribution of any weapon considered illegal in other charges. Scriptwise batons, canes, bats and golf clubs are still legal to distribute. ))'),('a05d63f7-6aa2-11eb-ac40-6045cb99fe9a','(9)07. Manufacture or Possession of an Improvised Device','1) Except as otherwise provided by law, A civilian who manufactures, assembles, disassembles, or possesses parts of any dangerous weapon, explosive, trap, firearm, blade or other destructive device that does not apply or is appropriate to any other penal code entries.\n 2) This may only be charged against person(s) when it can be proven an individual manufactured improvised blade(s), for example: in a prison environment, otherwise (9)01. Possession Of An Illegal Blade is to be used if an individual is found with an improvised blade.\n3) This code entry cannot stack with any other \"title\" 9. Control of Deadly Weapons And Equipment charges.\n\n - Penal Code (9)07 is a felony punishable by no less than 180 minutes imprisonment and no more than 240 minutes imprisonment.'),('a05d63f8-6aa2-11eb-bead-6045cb99fe9a','(9)08. Possession of Weapons With Intent To Sell','1) A person who is in possession of more than 5 full weapons or weapon components in any combination or amount with the intent to distribute, deliver, or sell.\n\n - Penal Code (9)08 is a felony punishable by no less than 300 minutes imprisonment and no more than 360 minutes imprisonment.'),('a05d63f9-6aa2-11eb-9f60-6045cb99fe9a','(9)09. Possession Of Explosive Devices With Intent To Sell','1) A person who is in possession of more than 3 explosive devices or explosive device materials in any combination with the intent to distribute, deliver, or sell.\n\n- Penal Code (9)09 is a felony punishable by no less than 360 minutes imprisonment and no more than 420 minutes imprisonment. '),('a05d8b00-6aa2-11eb-b6c9-6045cb99fe9a','(9)10. Brandishing A Firearm','1) A person who is pointing, holding, or brandishing a firearm, air or gas operated weapon, or object that appears like a firearm without proper toy and prop identification in an attempt to elicit fear or hysteria.\n 2) A person holding an object in a manner similar to a firearm who attempts to elicit the same fear or response as brandishing an actual firearm.\n\n- Penal Code (9)10 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 30 minutes imprisonment, as well as revocation of the person\'s firearms permit if applicable\n\nNOTES: Brandishing explicitly notes that the purpose is to elicit fear or hysteria. A Weapons Discharge violation is irrelevant of the intent to elicit hysteria so the two charges can be stacked if appropriate. '),('a05d8b01-6aa2-11eb-ba15-6045cb99fe9a','(9)11. Weapons Discharge Violation','1) A person who fires a firearm without due cause or justifiable motive regardless of registration status or legality.\n 2) A person committing this offense from a vehicle, whether land, sea, or in air, shall instead be charged with (9)12. Drive-By Shooting.\n\n - Penal Code (9)11 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 35 minutes imprisonment, as revocation of the person\'s firearms permit for seven day if applicable.\n\n NOTES: This charge can stack with brandishing a firearm, so you can in fact be charged both. A discharge however is different from brandishing, which requires the perpetrator to be using the brandishing as a way to elicit fear or hysteria.'),('a05d8b02-6aa2-11eb-b84e-6045cb99fe9a','(9)12. Drive-By Shooting','1) A person who drives a vehicle, whether on land, sea, or in air, and has a passenger who they knowingly and willingly let discharge a firearm from within the vehicle, and the passenger is not an on-duty peace officer.\n2) A person who exits a vehicle only to immediately discharge a firearm afterward.\n3) A person who discharges a weapon in a vehicle, whether on land, sea, or in air, and is not an on-duty peace officer with proper authorization.\n\n - Penal Code (9)12 is a felony punishable by no less than 240 minutes imprisonment and no more than 300 minutes imprisonment.'),('a05db21e-6aa2-11eb-a85e-6045cb99fe9a','(9)13. CCW - PF Violation','1) A person who carries concealed a legal, registered firearm that is not authorized as a conceal-carry weapon.\n 2) A person who carries concealed a legal, registered firearm that they are not authorized to carry concealed.\n 3) A person who does not carry proper permits or documentation for their weapon or occupational weapon usage.\n 4) Any other firearms regulatory violations as set by the appropriate licensing agency. \n\n- Penal Code (9)13 is a misdemeanor punishable by no less than 25 minutes imprisonment and no more than 40 minutes imprisonment as well as weapon license revocation upon Officer Discretion. This entire charge also falls under Officer Discretion.\n\n NOTES: The LSPD has the authority to regulate all firearms policy. Any violations of their policies apply to (9)13. This includes violations pertaining special weapons usage, such as for a prop as part of a production or as a security guard, etc. See (10)08 for more details. See below for links to appropriate LSPD pages for PF and CCW policies.'),('a05db21f-6aa2-11eb-a463-6045cb99fe9a','(10)00. Exception','1) Penal code entries, by default, may be modified by Sentencing Enhancements within \"title\" 10. However, should a penal code entry be the exception to a Sentencing Enhancement or contain an exception within its description, then that exception shall be followed instead of the Sentencing Enhancement policy.\n2) For example, (1)10. Murder cannot be charged for an attempt as an entire charge, (1)08. Attempted Murder, exists for that purpose.\n3) Penalties are, as stated, stackable for each occurrence. Committing assault against someone multiple times is worthy of a charge for each time, as long as they are separate police incidents or occur at different times, or occur to different people. Charges can also be stacked for each person they are committed against. Unless an exception exists explicitly.'),('a05db220-6aa2-11eb-8fab-6045cb99fe9a','(10)01. Attempt','1) A person who attempts to commit any crime, but fails or is prevented or intercepted in its perpetration, shall be given the same punishment as if the offense was committed.'),('a05dd91e-6aa2-11eb-9f97-6045cb99fe9a','(10)02. Conspiracy','1) If two or more persons conspire to commit any crime, to falsely and maliciously to indict another for any crime, or to procure another to be charged or arrested for any crime, they shall be punished by the same punishment as if the offense was committed.'),('a05dd91f-6aa2-11eb-9d78-6045cb99fe9a','(10)03. Soliciting','1) A person who solicits for the commission or perpetration of any crime shall be punished by the same punishment as if the offense was committed.'),('a05dd920-6aa2-11eb-9240-6045cb99fe9a','(10)04. Government Worker Clause','1) Any crime knowingly committed against a government worker or state agency employee, as defined by the State Constitution, shall punish the perpetrator with the maximum possible sentence allowed by that particular code entry, unless a judge orders a reduced sentence.'),('a05dd921-6aa2-11eb-832e-6045cb99fe9a','(10)05. Plea Bargaining - Police Compliance Clause','1) If a person, at the request of the District Attorney’s Office, or by other legal authorities within the State of San Andreas, complies to assistance in other activities sufficient to assist with the apprehension or prevention of criminals or crime in San Andreas, then that individual is permitted to receive bargains or other commutes to sentences and punishments issued.\n2)The specific amount of a sentence commute are subject to the circumstances of each situation of Plea Bargain or Police Compliance, at the discretion of the judge reviewing the case.'),('a05e003e-6aa2-11eb-a800-6045cb99fe9a','(10)06. Three-strikes Vehicle Policy','1) A person who drives a vehicle and receives three driver warnings shall have their vehicle impounded and their license revoked for between twelve (12) and forty-eight (48) hours at the officer’s discretion.\n 2) An individual who violates a penal code entry that states a specific punishment, such as a license revocation, shall have their vehicle impounded and licensed revoked for seven (7) days.\n 3) All warnings on record are removed upon revocation or suspension and the three-strikes vehicle policy resets.'),('a05e003f-6aa2-11eb-9d5e-6045cb99fe9a','(10)07. Criminal Accomplice Clause','1) A person who acts as an accomplice, aid, adviser, or other supportive role to another person\'s attempted or successful criminal acts shall receive HALF the punishment allotted to the person who attempted or successful criminal acts.'),('a05e0040-6aa2-11eb-aca1-6045cb99fe9a','(10)08. Accessory After the Fact ','1) A person who knowingly and willingly helps another person who had successfully committed a criminal act shall receive HALF the punishment issued to the person who committed the criminal act.\n 2) Examples include harboring a fugitive, helping destroy or distort evidence, or assisting the person evade or avoid police custody.'),('a05e0041-6aa2-11eb-83eb-6045cb99fe9a','(11)00.Limitations','1) No individual may be fined more than $25,000 in the course of a single road law incident in charges from \"title\" 11. Road Law.\n2) No individual may receive more than three driver warnings, amounting to a single license revocation, per road law incident.\n 3) No more than one of each code entry in \"title\" 11. Road Law may be issued on a driver per road law incident.\n 4) A road law incident is defined as the moment an officer engages a person until the conclusion of that engagement or situation.\n5) A peace officer is entitled to an exterior inspection of a vehicle, as well as verification of all paperwork, licenses, registrations, and other documentation during a traffic stop. A full vehicle inspection is permitted with a search warrant or appropriate probable cause.\n 6) Checkpoints, border controls, and other police operations on public roads must have a documented purpose, documented record of operations, and exist temporarily in response to (or in preparation to) a particular incident, holiday, etc.\n 7) A peace officer is only entitled to identify the driver of a vehicle when performing a traffic stop or other vehicle checkpoint operation, unless the passenger falls under a reasonable suspicion to be identified, such as matching an APB description.\n\n EXAMPLE: If an officer requests a driver to pull over, and the incident evolves into a pursuit, it is considered part of the same \"road law incident\" as it is a single, uninterrupted engagement. If the individual escapes or the pursuit is canceled, it is considered a conclusion to a single \"road law incident.\" This means, for example, if a pursuit ends, and the suspect is discovered again, new charges may be issued if they continue to evade police.'),('a05e2742-6aa2-11eb-aca2-6045cb99fe9a','(11)01. Speeding Violation','1) Speeding (Stopped in The Roadway) \n2) Speeding 15-25 kmh slower than the posted speed limit. \n 3) Speeding 10-15 kmh over the posted/known speed limit.\n4) Speeding 20-25 kmh faster than the posted/known speed limit\n5) Speed 25-30 kmh faster than the posted/known speed limit\n 6) Speed 25-40 kmh faster than the posted/known speed limit\n 7) Speed 40+ kmh faster than the posted/known speed limit\n 8) Speeding double or 100+ the posted/known speed limit. Whichever comes first.\n\n - Road Law (11)01 I. is an infraction punishable by a $65 fine.\n- Road Law (11)01 II.  is an infraction punishable by a $65 fine.\n - Road Law (11)01 III.  is an infraction punishable by a $170 fine.\n- Road Law (11)01 IV.  is an infraction punishable by a $234 fine.\n - Road Law (11)01 V.  is an infraction punishable by a $350 fine.\n - Road Law (11)01 VI is an infraction punishable by a $475 fine.\n - Road Law (11)01 VII. is an infraction punishable by a $550 fine.\n- Road Law (11)01 VIII is a felony punishable by a $1000 fine, imprisonment of no less than 25 minutes and no more than 40 minutes, as well as revoking of license for 3 months. '),('a05e2743-6aa2-11eb-b9f1-6045cb99fe9a','(11)02. Failure To Abide To A Traffic Control Device','1) A driver who fails to follow the instructions of a traffic control device, including:\n\n Fails to come to a FULL stop at “Stop Points”, noted as white or yellow lines at the edge of every intersection or with appropriate signage.\nCrossing a double yellow line when not entering or leaving a parking lot or private driveway.\n  Ignoring clearly visible signage, whether permanent or temporary, used to direct or control traffic in any way.\n Ignoring the instruction or direction of a peace officer or construction worker at a road works site.\n - A driver who fails to appropriately drive on the right properly with the flow of traffic, except in cases of emergency routes or private paths.\n\n - Road Law (11)02 is an infraction of $3,500 and a warning on the driver’s license at the peace officer’s discretion.'),('a05e2744-6aa2-11eb-b4b9-6045cb99fe9a','(11)03. Yield Violation','1) A person driving a vehicle that fails to yield, giving right of way, at an intersection that has other vehicles passing or waiting to turn.\n2) A person driving a vehicle that fails to yield, giving right of way, at any time to pedestrians or cyclist traffic.\n3) A person driving a vehicle that is standing, meaning not in motion and the driver is in the vehicle, on a public road or parking lot and refuses to keep moving upon order of a peace officer.\n Ignoring the emergency lights and sirens of an emergency vehicle requiring clearance.\n\n  - Road Law (11)03 is an infraction of $3,500 and a warning on the driver’s license at the peace officer’s discretion.'),('a05ec380-6aa2-11eb-9845-6045cb99fe9a','(11)04. Parking Violation','1) A vehicle parked, with its driver outside the vehicle, in the following ways:\n- In a manner that obstructs a lane of traffic and prevents the flow of traffic.\n- In a manner that completely obstructs an alleyway.\n- In a manner that obstructs a parking lot entrance.\n- Within a marked crosswalk.\n- In a manner that obstructs more than two thirds of a sidewalk or pedestrian path.\n- on any median.\n- Facing opposing traffic.\n- On any bridges or tunnels.\n- On any highway or freeway.\n- On railroad tracks or within range of being struck by a railroad car.\n- In the immediate ambulatory parking or bay area of a hospital or clinic.\n- In the immediate vicinity of Rodeo Bank\'s entrance, including the sidewalk adjacent to the metal barriers.\n- In front of or obstructing a private driveway or an entrance or exit to a private road or path.\n\n2) A vehicle parked in a manner not permitted by the property owner. Private property may set its own parking rules, so long as they do not obstruct any public roads or sidewalks. - Policies may also be set by a property manager authorized by the property owner. State agencies, such as the LSPD and others, may set parking rules for the facilities they maintain.\n3) A person who is sitting in a vehicle, with the engine on or off, in any above location and refuses to move at the request of a peace officer or, if private property, by the property manager.\n\n- Road Law (11)04 is an infraction punishable by a fine of $2,500 and risk of impoundment at the discretion of the peace officer.'),('a05ec381-6aa2-11eb-ad5e-6045cb99fe9a','(11)05. Reckless Driving','1) A person who demonstrates careless or general disregard for the safety of themselves or others while operating a vehicle, such as (but not limited to):\n- Driving on an unpopulated sidewalk, pedestrian passageway, or plaza\n- Meandering between lanes of traffic erratically.\n- Demonstrating poor control of the vehicle or driving decisions.\n- Road Law (11)05 is an infraction of $3,500 and a warning on the driver’s license at the peace officer’s discretion\n- This cannot stack with (11)06. Vehicular Endangerment.'),('a05eea92-6aa2-11eb-8e86-6045cb99fe9a','(11)06. Vehicular Endangerment','1) A person who demonstrates extreme carelessness while operating a vehicle, such as by nearly striking pedestrians, entering pedestrian passageways or nearly causing the severe harm of other motorists.\n2) A person who uses their vehicle in any manner that is dangerous to passengers, pedestrians, or nearby residents. \n 3) A person who drives on railroad tracks, busy pedestrian passageways or plazas, or on the opposite lane of travel with vehicles present, or on the opposite lane of travel on any freeway or highway.\n 4) Any activity that would be considered (11)05. Reckless Driving, but takes place within close proximity to nearby civilians, or in dense traffic.\n5) This cannot stack with (11)05. Reckless Driving.\n\n - Penal Code (11)06 is a misdemeanor punishable by impoundment of the individual’s vehicle with imprisonment of no less than 15 minutes and no more than 25 minutes.\n\n NOTES: Vehicular Endangerment cannot stack with reckless driving and is considered a more severe form of reckless driving. It serves as a catch-all for when an officer determines someone’s driving or usage of a vehicle to be beyond safe, reasonable activities. Also take note that this charge does stack with hit and run. Someone who commits a hit and run (hitting any vehicle or person and driving away) can be charged for each occurrence during the course of a road law incident. Per Limitations a driver can only receive either reckless driving or vehicular endangerment\nONCE per road law incident.'),('a05eea93-6aa2-11eb-9c33-6045cb99fe9a','(11)07. Vehicular Noise Violation','1) A driver whose vehicle emits excessive noise, creating a public nuisance. Examples include modifications to increase the noise pollution of their vehicle, or the excessive use of a vehicle horn or siren without justifiable purpose.\n\n - Road Law (11)07 is an infraction of $1,000.'),('a05eea94-6aa2-11eb-aca2-6045cb99fe9a','(11)08. Illegal Nitrous Oxide Possession','1)A person who drives a vehicle that contains, possesses, or shows characteristics of nitrous oxide equipment use while not on an official speedway or race track.'),('a05eea95-6aa2-11eb-b071-6045cb99fe9a','(11)09. Illegal Usage Of Hydraulics','1) A person driving a vehicle that uses hydraulic equipment while in motion or on a public street, road, or highway.\n 2) This excludes vehicles with hydraulic equipment permitted exclusively for business and equipment purposes, such as a forklift in motion.\n\n - Road Law (11)09 is an infraction of $2,500 and the impoundment of the individual’s vehicle.'),('a05f11a6-6aa2-11eb-8a24-6045cb99fe9a','(11)10. Driving While Impaired (DWI)','1) A person who drives a vehicle or operate heavy machinery while under the influence of alcohol below the legal limit of 0.08 percent BAV and also demonstrates an inability to safely operate their vehicle or equipment.\n2) A person who drives a vehicle or operates heavy machinery for commercial purposes while under the influence of alcohol at or above a 0.04 BAC.\n 3) A person who drives or operates heavy machinery under the influence of awareness-altering drugs, regardless of whether those drugs are being used under a prescription, and also demonstrates an inability to safely operate their vehicle or equipment.\n\n - Road Law (11)10 is a misdemeanor punishable by no less than 15 minutes imprisonment and no more than 60 minutes imprisonment, as well as the removal of the individual’s license and impoundment of their vehicle.\n- A person who is a government employee shall receive the maximum sentence and be referred to the HR of their respective State Agency.'),('a05f11a7-6aa2-11eb-ad18-6045cb99fe9a','(11)11. Driving Under The Influence (DUI)','1) A person who drives a vehicle or operate heavy machinery while under the influence of alcohol at or above the legal limit of 0.08 percent BAC\n\n - Road Law (11)11 is a felony punishable by no less than 60 minutes imprisonment and no more than 100 minutes imprisonment, as well as the removal of the individual’s license and impoundment of their vehicle.'),('a05f11a8-6aa2-11eb-bdcc-6045cb99fe9a','(11)12. Registration Violation','1) A person driving a vehicle on a state, county, or local road without an official owner’s registration or lease registration on file or in hand, or an individual who operates a motor vehicle with no valid license plates on a public roadway.\n\n - Road Law (11)12 is an infraction of $5000, as well as a driver’s warning or impoundment of the individual’s vehicle at the peace officer’s discretion.'),('a05f11a9-6aa2-11eb-a322-6045cb99fe9a','(11)13. Unsafe Usage Of A Bicycle','1) A person\'s unsafe usage of a bicycle or other self-propelled vehicle that obstructs traffic, incites disorder, creates a hazard, or demonstrates the potential for harm.\n2) A person who does not take safety precaution…….. while riding a bicycle.\n\n - Road Law (11)13 is an infraction of $2,500.'),('a05f38b0-6aa2-11eb-a242-6045cb99fe9a','(11)14. Street Racing','1) Performing an unlicensed or unauthorized vehicle race, performance, or competition on city, county, or state property\n2) Performing a vehicle race on a hazardous private course.\n 3) Organizing, facilitating, or promoting a street race or other unlicensed or organized vehicle race or competition on city, county, or state property.\n\n - Road Law (11)14 is a misdemeanor punishable by no less than 20 minutes imprisonment and no more than 35 minutes imprisonment.\n\n NOTES: A “race” or “competition” is any event that reasonably should not be taking place on a road. A hydraulics competition, for example, or a race around the dockyards both apply under street racing. Any parking lots not considered owned by a particular business (such as the old bank parking lot in Mulholland) are considered public state property.'),('a05f38b1-6aa2-11eb-bd39-6045cb99fe9a','(11)15. Driving without a Valid License','1) A person operating a motor vehicle without carrying a valid driver\'s license.\n 2) A person who refuses to show or provide a driver\'s license to a peace officer while operating a motor vehicle.\n 3) A person operating a motor vehicle under the age of 16.\n\n- Road Law (11)15 is a misdemeanor punishable by a $1000 fine. A vehicle that is being driven by someone without a valid driver’s license may be impounded.\n\n  NOTES: (( If a driver is under 16 with a valid /license, it shall be taken by the handling peace officer. ))'),('a05f38b2-6aa2-11eb-875b-6045cb99fe9a','(11)16. Jaywalking','1) A person who recklessly or intentionally crosses a road in a manner that creates a foreseeable risk of obstructing the flow of traffic, or otherwise creates a hazard to themselves and others.\n\n - Road Law (11)16 is an infraction of $1,000 at the peace officer’s discretion.'),('a05f38b3-6aa2-11eb-bc34-6045cb99fe9a','(11)17. Illegal Parking Of An Aircraft','1) A person who fails to follow the flight protocols as detailed in Section 5 of the State Aviation Act Of 2015\n\n - Road Law (11)17 is an infraction of $10,000 at the peace officer’s discretion.'),('a05f5fc0-6aa2-11eb-a6f7-6045cb99fe9a','(11)18. Tinted Windows','1) Windshield: Non-reflective tint must not exceed the top 4 inches of the windshield.\n 2)  Front Side Windows: VLT% must allow 70% of light into the vehicle.\n\n - Road Law (11)18 is an infraction of $75 and impoundment of the vehicle at the peace officer’s discretion.'),('a05f5fc1-6aa2-11eb-a240-6045cb99fe9a','(11)19. Illegal Color of Underglow','1) A vehicle that possess either a Red or Blue colored underglow. \n\n - Road Law (11)18 is an infraction of $125 and seizure of the vehicle.'),('a05f5fc2-6aa2-11eb-9646-6045cb99fe9a','(11)20. Unlawful Transport of Persons in a Cargo Area','1) A person who, while driving a pickup truck or flatbed motor truck transports any number of person(s) in or on the back of the vehicle, or in any area of the vehicle intended to transport cargo.\n\n - Road Law (11)19 is an infraction of $2,500, and impoundment of the vehicle at the peace officer’s discretion.\n\n NOTES: The charge of (11)19. Unlawful Transport of Persons in a Cargo Area should only be applied to the driver of the vehicle. Passengers shall not be fined, but only removed from the vehicle.'),('a05f5fc3-6aa2-11eb-a516-6045cb99fe9a','(11)21. Fire Hydrant Parking Restriction','1) No person shall stop, park, or leave standing any vehicle within 15 feet of a fire hydrant except as follows:\n - If the vehicle is attended by a licensed driver who is seated in the front seat and who can immediately move such vehicle in case of necessity.\n - If the vehicle is owned or operated by the fire department and is clearly marked as a fire department vehicle.\n\n - Road Law (11)20 is an infraction of $5,000 and impoundment of the vehicle at the peace officer’s discretion.'),('a05f86d4-6aa2-11eb-8e4d-6045cb99fe9a','(11)22. Broken Headlights-Tail lights','1) An individual operating a motor vehicle with a busted, broken, or otherwise destroyed lighting fixture on any portion of the vehicle. \n\n - Road Law (11)21 is an infraction punishable by a fine of $500.'),('a05f86d5-6aa2-11eb-86d2-6045cb99fe9a','(11)23. Unregistered Vehicle','1) A person(s) that operates a vehicle that is not properly registered by the San Andreas DMV.\n 2) A vehicle that does not possess a license plate.\n\n - Road Law (11)23 is an infraction punishable by $725 and seizure of the vehicle.'),('a05f86d6-6aa2-11eb-96ee-6045cb99fe9a','(11)24. driving without insurance -Offence','1) Every owner or lessee of a motor vehicle who, surrenders an insurance card (or fails to do so) for inspection to a police officer, when requested to do so, purporting to show that the motor vehicle is insured under a contract of automobile insurance when the motor vehicle is not so insured, is guilty of an offence and is liable on a first conviction to a fine of not less than $5,000 and not more than $25,000 and on a subsequent conviction to a fine of not less than $10,000 and not more than $50,000 and, in addition, his or her driver’s licence may be suspended for a period of not more than one year.\n\n (7) In the event of a conviction under subsection (3), the justice may order that the motor vehicle,\n\n1 that was operated in contravention of subsection (11)24.\n\n 2) for which a false statement in respect of insurance was made in contravention of subsection (11)24.\n\n3) for which an insurance card was produced in contravention of clause '),('a05fadee-6aa2-11eb-9190-6045cb99fe9a','(11)25. Hand-held devices prohibited','Wireless communication devices\n\n - No person shall drive a motor vehicle on a highway while holding or using a hand-held wireless communication device or other prescribed device that is capable of receiving or transmitting telephone communications, electronic data, mail or text messages. Fine - $2500, Repeat Liscence Suspension.'),('a05fadef-6aa2-11eb-ba47-6045cb99fe9a','(11)26. Backing prohibited, speed limit over 80 k.p.h.\n','- No driver of a vehicle shall back the vehicle upon the roadway or shoulder of any highway divided by a median strip on which the speed limit is in excess of 80 kilometers per hour. fine $1,000'),('a05fadf0-6aa2-11eb-832a-6045cb99fe9a','(11)27. Loading vehicles','Overhanging load- Every vehicle carrying a load which overhangs the rear of the vehicle to the extent of 1.5 metres or more while on a highway shall display upon the overhanging load at the extreme rear end thereof at any time from one-half hour before sunset to one-half hour after sunrise, or at any other time when there is insufficient light or unfavourable atmospheric conditions, a red light, and at all other times a red flag or a red marker sufficient to indicate the projection of the load. Every person who contravenes this section or a regulation made under subsection (3) is guilty of an offence and on conviction is liable to a fine of not less than $100 and not more than $200 and, in addition, his or her driver’s licence issued under section 32 and the person’s permit issued under section 7 may be suspended for a period of not more than sixty days.'),('a060231a-6aa2-11eb-b513-6045cb99fe9a','(12)01. Mistake of Fact','1) A person who commits an offense but claims, and can display proof that they acted on the honestly held belief they were not violating the law or did not understand the law that was violated.\n 2) This can only negate an offense if the offense requires mens rea, meaning a willful intention, knowing, or understanding that they are committing a crime.\n3) In any other cases, it may reduce the punishment for an offense at the discretion of the peace officer, or a judge when in a criminal suit.'),('a060231b-6aa2-11eb-814a-6045cb99fe9a','(12)02. Involuntary Intoxication','1) A person found to be involuntarily intoxicated, meaning they were evidently drugged or had their awareness impaired against their will or knowledge, cannot be found guilty of an offense as they did not have the adequate state of mind to do so.'),('a0604a22-6aa2-11eb-a7b2-6045cb99fe9a','(12)03. Private Defense, Self Defense, Castle Doctrine, And Defense Of Others','1) A person who has a reasonable belief that they, or another, are in imminent danger of being killed, seriously injured or unlawfully touched and believe that imminent force is needed to prevent that danger and use no more force than is necessary to negate that danger will absolve of criminal liability in \"title\" 1. Crimes Against the Person. ALL these requirements must be met to be completely absolved of criminal liability.\n 2) If not all requirements are met, charges may instead be reduced to up to half the minimum sentence for relevant offenses at the discretion of the peace officer or a judge.\n3) This also applies in the case of a person who is protecting their home from imminent danger or robbery when on private property.\n 4) This defense cannot be applied in cases of gang on gang violence or in other such instances where the party claiming the defense was put at risk of immediate danger by their own involvement with actionable criminality.'),('a0604a23-6aa2-11eb-af12-6045cb99fe9a','(12)04. Necessity','1) A person who commits an offense out of necessity to protect themselves or others from significant bodily harm or emergency, has no adequate legal alternative, did not create a greater danger through their actions and held an actual and reasonable belief that their action was necessary to prevent harm, will be absolved of criminal liability for the offense deemed to be committed as a necessity to prevent greater harm.\n 2) This defense cannot be applied in cases of gang on gang violence or in other such instances where the party claiming the defense was put at risk of immediate danger by their own involvement with actionable criminality.'),('a0604a24-6aa2-11eb-a7a0-6045cb99fe9a','(12)05. Entrapment','1) A person who would not have committed an offense if not for for the harassment, threats, or coercion to do so by members of law enforcement cannot be found guilty of the offense that they were persuaded to commit.'),('a0607130-6aa2-11eb-8621-6045cb99fe9a','(12)06. Duress','1) A person who commits any offense in response to immediate threats to kill from a third party and does so in order to negate those threats cannot be found to have had the required criminal intent with which to be held liable for an offense.\n2) The only exception to this are severe crimes against the person, such as torture, murder, and attempted murder, as it is not justifiable to take or severely harm another life unless in an act of self defense.     '),('a0607131-6aa2-11eb-9725-6045cb99fe9a','(12)07. Parole Exclusions','1) A person who is guilty of (1)13. Mayhem, (1)12. Kidnapping, (1)08. Attempted Murder with the Government Worker Clause, (1)10. Murder, (1)09. Manslaughter and (4)21. Violation of Parole Or Probation shall be always excluded from any opportunity of parole.'),('a0607132-6aa2-11eb-ac84-6045cb99fe9a','(12)08. Suspicion Policy','1) A peace officer\'s or court\'s justifiable suspicion of a person to commit or conspire to commit a crime is sufficient to allow that individual to be detained for questioning for no more than 60 minutes in police or court custody, however they cannot be searched beyond a legal Terry Frisk for the officer’s safety unless probable cause or concurrent evidence emerges.\n2) A person who is at the scene of a crime, riot, or major public disturbance may also be classified under the suspicion policy for temporary detainment.\n 3) Violation of this policy, or an act of justifiable suspicion that extends beyond legal bounds, extends beyond Color of Law and is satisfactory for suit.\n4) A person who fails to identify themselves to a peace officer during arrest or arraignment shall be imprisoned for the maximum time allowed by the law until they can be successfully identified by a peace officer or the courts.'),('a0607133-6aa2-11eb-8f27-6045cb99fe9a','(12)09. Officer Discretion','1) Law enforcement officers shall have the authority to use their discretion when issuing infractions or select misdemeanors. This discretion entitles the officer to choose to forego an infraction or misdemeanor penalty based on their personal judgement.\n 2) Officers must choose to issue Officer Discretion and forego charging, not issue a fine or other punishment in lieu of the typical punishment.\n 3) Officers cannot elect Officer Discretion if the independent victim, property owner, or affected party chooses to press charges against the perpetrator.\n4) Double Jeopardy still applies, meaning a senior officer cannot revoke Officer Discretion once it is issued unless it was issued in disregard for a party wishing to press charges.\n 5) All misdemeanors that fall under Officer Discretion shall state as such in the sentencing portion of the charge.'),('a0609842-6aa2-11eb-8811-6045cb99fe9a','(12)10. Good Samaritan Clause','1) Citizens may perform a legal Citizen’s Arrest when an individual has committed a misdemeanor or greater offense and the citizen wishes to restrain the individual until proper authorities can arrive to support, assist, or assess the situation.\n 2) Citizens may, at the request of the government worker, may give their assistance with carrying out official government business, so long as it doesn’t extend beyond the powers, duties, responsibilities, and authorities of that government worker.\n 3) Citizens may come to the aid of a government worker who is in duress or incapacitated during official government business to save or protect their life or assist informing official agents. '),('a0609843-6aa2-11eb-b830-6045cb99fe9a','(12)11. Imprisonment & Punishment Criteria','1) Only criminal violations that originate from the San Andreas Penal Code may carry a misdemeanor or felony-level punishment with imprisonment in a county or state penitentiary.\n 2) All felonies must carry with their punishment imprisonment at the San Andreas State Correctional Facility.\n 3) All persons convicted of more than 45 minutes imprisonment will carry their sentence at the San Andreas State Correctional Facility. All persons convicted of less than 35 minutes will carry their sentence at the appropriate county facility. All persons convicted of between 35 and 45 minutes will be imprisoned at the location of Officer Discretion.\n 4) Each penal code entry may include a range of time for imprisonment. While some entries dictate instances where the maximum or minimum time of imprisonment must be used, in all other instances the peace officer issuing the arrest may use their discretion, based on severity, cooperativeness of the suspect, or other criteria to decide the time within\n 5) The LSPD and SASD may set internal policies to dictate how officers should follow Imprisonment & Punishment Criteria, so long as it does not violate the minimum and maximum punishment policies stated in this Penal Code.\n 6) Each bullet number in a penal code entry refers to an applicable charge for each entry. Violating any one of the descriptions is a violation of the penal code entry.\n 7) (( Persons who roleplay without a sound mind will still, in any case, be arrested and charged for the crime they commit. Technically they’d be delivered to an appropriate institution in-character but are dropped off to the local county or state jail before being sent there. They would not be placed with the regular prison population. ))\n More on the next page'),('a0609844-6aa2-11eb-9279-6045cb99fe9a','(12)12. Maximum Imprisonment ','1) A person cannot be imprisoned for longer than 900 minutes despite the number of charges on this individual exceeding a 900 minute penalty, unless said sentence is approved by a Justice of the Courts of San Andreas, the Attorney General, or by the Governor of San Andreas.\n2) A person who cannot be effectively identified shall be imprisoned for 900 minutes until they can be properly identified or they fulfill the 900 minute imprisonment. If they are identified, the total time served will be deducted from the time due, with immediate release if they fulfilled more than the total time. A person released with more time spent in prison than their charges yield is not subject to excessive or wrongful imprisonment\n 3) At the Governor’s discretion, an individual who commits a felony may qualify for death row status, yielding permanent imprisonment unless the Governor issues a pardon.     '),('a0609845-6aa2-11eb-a95e-6045cb99fe9a','(12)13. Wiretapping, CCTV & Videotaping Policy','1) The State of San Andreas shall have a one-party notification policy for wiretapping without appropriate surveillance warrants and authorizations.\n2) A person who is found to violate these wiretapping laws can be charged with (13)09. Wiretapping Violation\n3) Moles, bugs, and other illegal surveillance falls under wiretapping laws and violations / policies.\n 4) Government Employees may be recorded by civilians at all times when conducting their duties in an official capacity or when on-duty.\n 5) ((CCTV is considered reasonably accessible to the courts when sourced from inside and around all public facilities, from police dashcams, or when subpoenaed by a private business that claims to have CCTV cameras installed. Public CCTVs cannot be tampered, modified, stolen, or destroyed.))\n 6) ((CCTVs in businesses must be explicitly recorded as existing on paperwork or a license to be used in court or accepted legally.))\n\n NOTES: So long as one party (either person on the phone, in a facility, or other location where a conversation or event is being recorded) is aware of the situation it is considered a legal recording. Property owners always have full surveillance rights to their property and facilities, parking lots, etc. they maintain.       '),('a060bf5a-6aa2-11eb-b7b7-6045cb99fe9a','(12)14. Police Exigency Hot Pursuit Policy','1) Peace officers have the authority to follow suspects into private property if directly related to an ongoing pursuit. Entry related to investigations or other projects not in a direct pursuit of a suspect require a warrant.\n 2) Peace officers have the authority to enter the public area of a private facility, such as the public area of a club or restaurant, at all times the facility is open to the public. Private areas of the facility require permission of the facility manager or a warrant.\n 3) __(12)15 Probable Cause & Plain View Policy__ still applies when an officer is entering a facility for hot pursuit or entering the public area of a private facility.\n\n NOTES: This includes multiple rooms where a suspect could reasonably have ran to, such as several apartments within an apartment complex.      '),('a060bf5b-6aa2-11eb-8477-6045cb99fe9a','(12)15. Probable Cause & Plain View Policy','1) Peace officers have the power to seize and record evidence upon any event that is in their plain view so long as they have a legal reason to be where they’re located at the time.\n2) A person who gives a government employee permission to view or access a facility, equipment or other areas is permitting an officer to view a facility for probable cause or plain view evidence.\n3) Probable Cause does not have a specific definition, but refers to the ongoing premise that an officer’s “gut feeling” supported by plain view evidence (such as the smell of marijuana or other items) that would imply a probable situation of criminality and authorize a search based on that evidence. Probable Cause can be circumstantially contested in a court of law.\n\n NOTES: Plain View applies even when an officer is in hot pursuit and enters, for example, an apartment complex and sees a clear criminal act in progress while chasing someone. They can call in other units to seize and handle that situation too.      '),('a060bf5c-6aa2-11eb-a2c4-6045cb99fe9a','(12)16. Criminal Fines ','1) The Department of Justice may seek Criminal Fines through the State of San Andreas Court, to accompany imprisonment, for all felony and misdemeanor charges. The court shall impose a fine in all cases, except where the defendant establishes that he is unable to pay and is not likely to become able to pay any fine. A person who articulates and furnishes financial documentation to indicate financial difficulties with paying the fine shall be afforded additional time to pay the fine through a deadline established by the courts or through a payment plan to the Department of Justice. The fines may stack. The fines are as follows:\n- $25,000 for any misdemeanor charges.\n- $50,000 for any non-violent felony.\n- $100,000 for any violent felony.\n- $150,000 for (1)10. Murder\n\n NOTES: All fines paid shall be documented and a record shall be maintained by the Department of Justice. Fines may be used for expenses encumbered during the trial and any departmental authorized expenses.  '),('a060e662-6aa2-11eb-9dec-6045cb99fe9a','(12)17. Repeat Offender Clause','1) The District Attorney\'s Office, a representative of the Governor\'s Office, or a judge may charge a person who\'s arrested for at least one felony or misdemeanor, who has been previously convicted of at least one felony or misdemeanor, with this clause, which will increase the time due by one-hundred percent (100%) for the repeat offender.\n 2) A judge may issue an indefinite suspension to any license under the repeat offender clause when it has been demonstrated that the person is likely not to cease committing the offense in the future.\n 3) A judge may order the indefinite seizure of any vehicle used in the commission of the crime when it has been demonstrated that an individual is unlikely to cease committing the offense in the future and such vehicle was used in the commission of the crime.\n\nNOTES: A repeat offender is someone who has been to prison for a felony before and is now arrested for another felony. Only a (Deputy)District Attorney may charge someone with this and it\'ll double the criminal\'s time.      '),('a061829e-6aa2-11eb-82fd-6045cb99fe9a','(12)18. Immunity','1) At the request of a law enforcement officer and in return for witness testimony, a district attorney may choose to grant a person either a transactional immunity or use and derivative use immunity.\n 2) A transactional immunity is a type of immunity where a person cannot be charged for a crime revealed in his/her testimony.\n 3) A use and derivative use immunity is a type of immunity which guarantees that a person\'s testimony cannot be used against him/her.');


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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `officer_logs`
--
ALTER TABLE `officer_logs`
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
