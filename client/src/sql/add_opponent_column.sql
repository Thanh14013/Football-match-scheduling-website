-- Thêm cột opponent vào bảng matches
ALTER TABLE public.matches
ADD COLUMN opponent text;

-- Cập nhật RLS policy cho cột mới
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY; 