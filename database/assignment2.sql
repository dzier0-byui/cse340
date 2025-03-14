--insert value into 'account' table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--update account for 'Tony Stark'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--delete account for 'Tony Stark'
DELETE FROM public.account
WHERE account_id = 1;
--update GM Hummer
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
--select inventory make & model with the classification name where the classification is 'Sport'
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory AS i
    INNER JOIN public.classification AS c ON c.classification_id = i.classification_id
WHERE c.classification_name = 'Sport';
--update file path to have '/vehicles'
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');