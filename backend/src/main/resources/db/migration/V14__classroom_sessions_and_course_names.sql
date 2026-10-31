UPDATE courses
SET name = CASE code
    WHEN 'ARI-001' THEN 'Aritmetica'
    WHEN 'ALG-001' THEN 'Algebra'
    WHEN 'GEO-001' THEN 'Geometria'
    WHEN 'TRI-001' THEN 'Trigonometria'
    WHEN 'RM-001' THEN 'Razonamiento Matematico'
    ELSE replace(name, ' Preuniversitaria', '')
END;

ALTER TABLE lessons
ADD COLUMN material_type VARCHAR(30) NOT NULL DEFAULT 'VIDEO',
ADD COLUMN material_name VARCHAR(220),
ADD COLUMN week_number INTEGER NOT NULL DEFAULT 1;

UPDATE lessons
SET material_type = 'VIDEO',
    material_name = title,
    week_number = sequence;
