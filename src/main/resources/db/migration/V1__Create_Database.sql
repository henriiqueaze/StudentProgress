CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `birth_date` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `cpf` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `notes` varbinary(255) NOT NULL,
  `registration` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
)