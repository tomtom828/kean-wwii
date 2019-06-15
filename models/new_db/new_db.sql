-- Create new database
CREATE DATABASE keanwwiiscrapbook_db;
USE keanwwiiscrapbook_db;


-- Sample Query for Author Bio
SELECT authors.id, authors.last_name, authors.first_name, author_bio_meta.bio_attribute, author_bio.bio_attrib_value
FROM author_bio
INNER JOIN authors ON authors.id = author_bio.author_id
INNER JOIN author_bio_meta ON author_bio.author_bio_meta_id = author_bio_meta.id
ORDER BY authors.id, author_bio_meta.sort_key;