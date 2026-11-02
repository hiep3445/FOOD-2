-- Rename image_key column to image_url to allow direct image links without R2
ALTER TABLE products RENAME COLUMN image_key TO image_url;

-- Populate starter products with curated food photos

-- 1. Cơm gà nướng mật ong
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1766050587783-1c90751275dd?auto=format&fit=crop&w=800&q=80'
WHERE id = 'mon-com-ga-nuong-mat-ong';

-- 2. Cơm sườn nướng trứng
UPDATE products SET image_url = 'https://static.riviu.co/image/2019/12/21/c40ddac5a8ff0493ff45bc39ec836db6_output.jpeg'
WHERE id = 'mon-com-suon-nuong-trung';

-- 3. Cơm cá kho tộ
UPDATE products SET image_url = 'https://i.ytimg.com/vi/BfD1KwGwkqA/maxresdefault.jpg'
WHERE id = 'mon-com-ca-kho-to';

-- 4. Cơm thịt kho trứng
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Th%E1%BB%8Bt_kho_h%E1%BB%99t_v%E1%BB%8Bt.jpg/1280px-Th%E1%BB%8Bt_kho_h%E1%BB%99t_v%E1%BB%8Bt.jpg'
WHERE id = 'mon-com-thit-kho-trung';

-- 5. Bún thịt nướng
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Bun_thit_nuong.jpg/1280px-Bun_thit_nuong.jpg'
WHERE id = 'mon-bun-thit-nuong';

-- 6. Phở bò tái
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Pho_bo.jpg/1280px-Pho_bo.jpg'
WHERE id = 'mon-pho-bo-tai';

-- 7. Bún bò Huế
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/B%C3%BAn_b%C3%B2_Hu%E1%BA%BF_%E1%BB%9F_%C4%90%C3%A0_N%E1%BA%B5ng.jpg/1280px-B%C3%BAn_b%C3%B2_Hu%E1%BA%BF_%E1%BB%9F_%C4%90%C3%A0_N%E1%BA%B5ng.jpg'
WHERE id = 'mon-bun-bo-hue';

-- 8. Gỏi cuốn tôm thịt
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/G%E1%BB%8Fi_cu%E1%BB%91n.jpg/1280px-G%E1%BB%8Fi_cu%E1%BB%91n.jpg'
WHERE id = 'mon-goi-cuon-tom-thit';

-- 9. Chả giò nhà làm (dùng bản 1280px để tải nhanh hơn 1920px)
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Cha_gio_%28vitnamese_spring_roll%29.jpg/1280px-Cha_gio_%28vitnamese_spring_roll%29.jpg'
WHERE id = 'mon-cha-gio-nha-lam';

-- 10. Canh chua cá (dùng bản 1280px 294KB thay vì file gốc 2.3MB để web tải mượt)
UPDATE products SET image_url = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Canhchua1.jpg/1280px-Canhchua1.jpg'
WHERE id = 'mon-canh-chua-ca';
