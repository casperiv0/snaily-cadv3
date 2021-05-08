import { createConnection, Connection, ConnectionConfig } from "@casper124578/mysql.ts";
import { Tables } from "../interfaces/Tables";
import config from "./config.server";
import { logger } from "./logger";

const INTERVAL_5_SECS = 5 * 1000;
const options: ConnectionConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.databaseName,
  timeout: 0,
};

async function connect(): Promise<Connection<Tables>> {
  const conn = await createConnection<Tables>(options);

  global.connection = conn;

  return conn;
}
connect();

export async function processQuery<T = unknown>(
  query: string,
  data?: unknown[],
): Promise<(T | undefined)[]> {
  if (!global.connection) {
    await connect();
  }

  try {
    return global.connection.query().raw(query, data).exec();
  } finally {
    // connection?.end();
  }
}

// keep connection open.
const interval = setInterval(select1, INTERVAL_5_SECS);

async function select1() {
  await processQuery("SELECT 1").catch((e) => {
    clearInterval(interval);
    logger.error("DB_ERROR", e);
  });
}

async function updateLine(sql: string) {
  try {
    await processQuery(sql);
  } catch (e) {
    const saveCodes = ["ER_TABLE_EXISTS_ERROR", "ER_DUP_FIELDNAME", "ER_CANT_DROP_FIELD_OR_KEY"];
    if (saveCodes.includes(e.code)) return;

    console.error(e);
  }
}

async function updateDb() {
  updateLine(
    "ALTER TABLE `leo_incidents` ADD `gsr` varchar(255) NOT NULL AFTER `firearms_involved`;",
  );
  updateLine(
    "ALTER TABLE `cad_info` ADD `on_duty_status` varchar(255) DEFAULT '10-8' AFTER `whitelisted`;",
  );
  updateLine(
    "ALTER TABLE `cad_info` ADD `assigned_status` varchar(255) DEFAULT '10-97' AFTER `whitelisted`;",
  );
  updateLine(
    "ALTER TABLE `cad_info` ADD `height_prefix` varchar(255) DEFAULT 'cm' AFTER `whitelisted`;",
  );
  updateLine(
    "ALTER TABLE `cad_info` ADD `weight_prefix` varchar(255) DEFAULT 'kg' AFTER `whitelisted`;",
  );
  updateLine(
    "ALTER TABLE `citizens` ADD `is_dangerous` varchar(255) DEFAULT '0' AFTER `b_status`;",
  );
  updateLine("ALTER TABLE `officers` ADD `suspended` varchar(255) DEFAULT '0' AFTER `status`;");
  updateLine("ALTER TABLE `penal_codes` ADD `fine_amount` varchar(255) DEFAULT NULL AFTER `des`;");
  updateLine("ALTER TABLE `penal_codes` ADD `jail_time` varchar(255) DEFAULT NULL AFTER `des`;");
  updateLine(`
  CREATE TABLE \`mugshots\` (
    \`id\` varchar(255) NOT NULL,
    \`citizen_id\` varchar(255) NOT NULL,
    \`data\` text NOT NULL DEFAULT '[]',
    \`officer_name\` varchar(255) NOT NULL,
    \`full_date\` text NOT NULL,
    \`officer_id\` varchar(255) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  updateLine(`
  CREATE TABLE \`cad_licenses\` (
    \`id\` varchar(255) NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`defaults\` varchar(255) NOT NULL DEFAULT '0',
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  updateLine("ALTER TABLE `officers` ADD `citizen_id` varchar(255) DEFAULT NULL AFTER `status`;");
  updateLine("ALTER TABLE `warrants` ADD `officer_name` text DEFAULT NULL AFTER `status`;");
  updateLine("ALTER TABLE `bolos` ADD `officer_name` text DEFAULT NULL AFTER `plate`;");
  updateLine(
    "ALTER TABLE `cad_info` ADD `registration_code` varchar(255) DEFAULT NULL AFTER `plate_length`;",
  );
  updateLine(
    "ALTER TABLE `cad_info` ADD `show_aop` varchar(255) NOT NULL DEFAULT '1' AFTER `plate_length`;",
  );
  updateLine("ALTER TABLE `bleets` DROP `markdown`;");
  updateLine("ALTER TABLE `ems-fd` ADD `callsign` varchar(255) NOT NULL AFTER `name`;");
  updateLine(
    "ALTER TABLE `cad_info` ADD `max_citizens` varchar(255) NOT NULL DEFAULT 'unlimited' AFTER `plate_length`;",
  );

  updateLine(`
  CREATE TABLE \`leo_incidents\` (
    \`id\` varchar(255) NOT NULL,
    \`case_number\` int(11) NOT NULL,
    \`officer_dept\` varchar(255) NOT NULL,
    \`officer_name\` varchar(255) NOT NULL,
    \`full_date\` text NOT NULL,
    \`involved_officers\` text NOT NULL,
    \`location\` varchar(255) NOT NULL,
    \`officer_id\` varchar(255) NOT NULL,
    \`narrative\` text NOT NULL,
    \`injuries\` varchar(255) NOT NULL,
    \`arrests_made\` varchar(255) NOT NULL,
    \`firearms_involved\` varchar(255) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  updateLine(`
  CREATE TABLE \`seo_tags\` (
    \`title\` varchar(255) DEFAULT 'SnailyCAD',
    \`description\` text DEFAULT 'A free, fast, simple and secure open source CAD/MDT',
    \`site_name\` varchar(255) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  updateLine("ALTER TABLE `911calls` ADD `type` varchar(255) NOT NULL AFTER `status`;");
  updateLine("ALTER TABLE `10_codes` ADD `position` int(255) NOT NULL AFTER `should_do`;");
  updateLine("ALTER TABLE `officers` DROP `started_at`;");
  updateLine(`
CREATE TABLE \`call_events\` (
  \`id\` varchar(255) NOT NULL,
  \`call_id\` varchar(255) NOT NULL,
  \`date\` varchar(255) NOT NULL,
  \`text\` text NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  updateLine("ALTER TABLE `citizens` ADD `dead_on` varchar(255) NOT NULL AFTER `phone_nr`;");
  updateLine("ALTER TABLE `citizens` ADD `dead` varchar(255) NOT NULL AFTER `phone_nr`;");
  updateLine("ALTER TABLE `cad_info` ADD `features` text NOT NULL AFTER `plate_length`;");
  updateLine("ALTER TABLE `users` ADD `supervisor` varchar(255) NOT NULL AFTER `leo`;");
  updateLine("ALTER TABLE `officers` ADD `rank` varchar(255) NOT NULL AFTER `callsign`;");
  updateLine("ALTER TABLE `citizens` ADD `phone_nr` varchar(255) NOT NULL AFTER `note`;");
  updateLine(
    "ALTER TABLE `cad_info` ADD `steam_api_key` varchar(255) NOT NULL AFTER `webhook_url`;",
  );
  updateLine("ALTER TABLE `911calls` ADD `hidden` varchar(255) NOT NULL AFTER `assigned_unit`;");
  updateLine(
    "ALTER TABLE `users` ADD `avatar_url` varchar(255) NOT NULL AFTER `whitelist_status`;",
  );
  updateLine("ALTER TABLE `users` ADD `steam_id` varchar(255) NOT NULL AFTER `whitelist_status`;");
  updateLine(
    "ALTER TABLE `cad_info` ADD `live_map_url` varchar(255) NOT NULL AFTER `webhook_url`;",
  );
  updateLine("ALTER TABLE `911calls` ADD `pos` text NOT NULL AFTER `assigned_unit`;");
  updateLine(" ALTER TABLE `cad_info` ADD `plate_length` int(255) NOT NULL AFTER `webhook_url`;");
  updateLine("ALTER TABLE `cad_info` ADD `signal_100` varchar(255) NOT NULL AFTER `plate_length`;");
  updateLine(`
  CREATE TABLE \`10_codes\` (
    \`id\` varchar(64) NOT NULL,
    \`code\` varchar(255) NOT NULL,
    \`color\` varchar(255) NOT NULL,
    \`what_pages\` text,
    \`should_do\` text,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  updateLine(`
    CREATE TABLE \`penal_codes\` (
      \`id\` varchar(64) NOT NULL,
      \`title\` longtext,
      \`des\` longtext,
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  updateLine(`
  CREATE TABLE \`officer_logs\` (
    \`id\` varchar(255) NOT NULL,
    \`officer_id\` varchar(255) NOT NULL,
    \`started_at\` varchar(255) NOT NULL,
    \`ended_at\` varchar(255) NOT NULL,
    \`active\` varchar(255) NOT NULL,
    \`user_id\` varchar(255) NOT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

  updateLine(
    "ALTER TABLE `911calls` CHANGE `assigned_unit` `assigned_unit` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;",
  );
  updateLine(`
    --
    -- Table structure for table \`notifications\`
    --

    CREATE TABLE \`notifications\` (
      \`id\` varchar(255) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`text\` text NOT NULL,
      \`href\` text NOT NULL,
      \`user_id\` varchar(255) NOT NULL,
     PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  updateLine(`CREATE TABLE \`court_requests\` (
        \`id\` varchar(255) NOT NULL,
        \`warrants\` varchar(2500) NOT NULL,
        \`arrest_reports\` varchar(2500) NOT NULL,
        \`tickets\` varchar(2500) NOT NULL,
        \`citizen_id\` varchar(255) NOT NULL,
        \`user_id\` varchar(255) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

  updateLine("ALTER TABLE `citizens` ADD `note` VARCHAR(255) NOT NULL AFTER `b_status`;");
  updateLine("ALTER TABLE `officers` ADD `callsign` VARCHAR(255) NOT NULL AFTER `officer_dept`;");
}

updateDb();
