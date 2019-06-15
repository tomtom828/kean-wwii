-- Select database
USE keanwwiiscrapbook_db;

-- Create Author Bio Meta Data Table
CREATE TABLE author_bio_meta(
  id INTEGER PRIMARY KEY,
  bio_attribute varchar(300) DEFAULT NULL,
  sort_key INTEGER DEFAULT NULL
);

-- Add to table
INSERT INTO author_bio_meta(id, bio_attribute, sort_key)
VALUES ("1","Date of Birth","1"),
("2","Enlistment Date","10"),
("3","Discharge Date","11"),
("4","Date Deceased","2"),
("5","Last Known Location","3"),
("6","Date Enrolled NSTC","5"),
("7","Date Left NSTC","6"),
("8","Reason","7"),
("9","Date Returned to NSTC","8"),
("10","Date Graduated from NSTC","9"),
("11","Degree","4");
