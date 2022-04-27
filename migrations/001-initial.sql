DROP TABLE IF EXISTS uploadedFiles;

CREATE TABLE uploadedFiles (
  --- series of colums
  file_id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL
);