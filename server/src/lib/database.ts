import mysql, { ConnectionConfig } from "promise-mysql";
import config from "../lib/config";
import Logger from "./Logger";
const INTERVAL_5_SECS = 5000;

const options: ConnectionConfig = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.databaseName,
  multipleStatements: true,
  timeout: 0,
};

export async function connect(): Promise<mysql.Connection> {
  return await mysql.createConnection(options);
}

export async function processQuery<T = any>(query: string, data?: any[]): Promise<T[]> {
  const conn = await connect();
  try {
    return await conn.query(query, data);
  } finally {
    if (conn) {
      conn.end();
    }
  }
}

const interval = setInterval(select1, INTERVAL_5_SECS);

async function select1() {
  await processQuery("SELECT 1").catch((e) => {
    clearInterval(interval);
    Logger.error("DB_ERROR", e);
  });
}

async function updateLine(sql: string) {
  try {
    await processQuery(sql);
  } catch (e) {
    const saveCodes = ["ER_TABLE_EXISTS_ERROR", "ER_DUP_FIELDNAME", "ER_CANT_DROP_FIELD_OR_KEY"];
    if (saveCodes.includes(e.code)) return;

    console.log(e);
  }
}

async function updateDb() {
  import("./insert");

  updateLine(
    "ALTER TABLE `cad_info` ADD `max_citizens` varchar(255) NOT NULL DEFAULT 'unlimited' AFTER `plate_length`;",
  );
  updateLine(`
  CREATE TABLE \`call_types\` (
    \`id\` varchar(255) NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`defaults\` varchar(255) NOT NULL DEFAULT '0',
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  
  `);

  updateLine("ALTER TABLE `users` ADD `edit_passwords` varchar(255) NOT NULL AFTER `rank`;");
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

  updateLine(`
    ALTER TABLE \`911calls\` CHANGE \`assigned_unit\` \`assigned_unit\` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL; 
    --
    -- Table structure for table \`notifications\`
    --
    
    CREATE TABLE \`notifications\` (
      \`id\` varchar(255) NOT NULL,
      \`title\` varchar(255) NOT NULL,
      \`text\` text NOT NULL,
      \`href\` text NOT NULL,
      \`user_id\` varchar(255) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    
    -- --------------------------------------------------------
    
    --
    -- Indexes for table \`notifications\`
    --
    ALTER TABLE \`notifications\`
      ADD PRIMARY KEY (\`id\`);
    `);
  updateLine(
    `
      CREATE TABLE \`court_requests\` (
        \`id\` varchar(255) NOT NULL,
        \`warrants\` varchar(2500) NOT NULL,
        \`arrest_reports\` varchar(2500) NOT NULL,
        \`tickets\` varchar(2500) NOT NULL,
        \`citizen_id\` varchar(255) NOT NULL,
        \`user_id\` varchar(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      
      -- ------------
      
      --
      -- Indexes for table \`court_requests\`
      --
      ALTER TABLE \`court_requests\`
        ADD PRIMARY KEY (\`id\`);
      ALTER TABLE \`citizens\` ADD \`note\` VARCHAR(255) NOT NULL AFTER \`b_status\`;ALTER TABLE \`officers\` ADD \`callsign\` VARCHAR(255) NOT NULL AFTER \`officer_dept\`;`,
  );
}

updateDb();
