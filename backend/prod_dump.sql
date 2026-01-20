--
-- PostgreSQL database dump
--


-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist DROP CONSTRAINT IF EXISTS wishlist_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_views DROP CONSTRAINT IF EXISTS product_views_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_views DROP CONSTRAINT IF EXISTS product_views_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist DROP CONSTRAINT IF EXISTS wishlist_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.product_views DROP CONSTRAINT IF EXISTS product_views_pkey;
ALTER TABLE IF EXISTS ONLY public.product_reviews DROP CONSTRAINT IF EXISTS product_reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.product_categories DROP CONSTRAINT IF EXISTS product_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.orders DROP CONSTRAINT IF EXISTS orders_pkey;
ALTER TABLE IF EXISTS ONLY public.order_items DROP CONSTRAINT IF EXISTS order_items_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_user_id_key;
ALTER TABLE IF EXISTS ONLY public.carts DROP CONSTRAINT IF EXISTS carts_pkey;
ALTER TABLE IF EXISTS ONLY public.cart_items DROP CONSTRAINT IF EXISTS cart_items_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_views ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.product_reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.orders ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.carts ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.wishlist;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.products_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.product_views_id_seq;
DROP TABLE IF EXISTS public.product_views;
DROP SEQUENCE IF EXISTS public.product_reviews_id_seq;
DROP TABLE IF EXISTS public.product_reviews;
DROP TABLE IF EXISTS public.product_categories;
DROP SEQUENCE IF EXISTS public.orders_id_seq;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.order_items;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.carts_id_seq;
DROP TABLE IF EXISTS public.carts;
DROP TABLE IF EXISTS public.cart_items;
SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer,
    status character varying(20) DEFAULT 'open'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer,
    price numeric(10,2)
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_categories (
    product_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer,
    user_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: product_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_views (
    id integer NOT NULL,
    product_id integer,
    user_id integer,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_views_id_seq OWNED BY public.product_views.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2),
    stock integer,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    discount_percentage numeric(5,2) DEFAULT 0,
    rate numeric(3,2)
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role_id integer
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist (
    user_id integer NOT NULL,
    product_id integer NOT NULL
);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: product_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views ALTER COLUMN id SET DEFAULT nextval('public.product_views_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (cart_id, product_id, quantity) FROM stdin;
137	29	2
137	90	4
137	1	1
136	29	5
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, status, created_at) FROM stdin;
136	17	open	2026-01-19 23:52:16.235942
137	13	open	2026-01-19 23:53:11.654042
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name) FROM stdin;
1	Electrónica
2	Ropa
3	Hogar
4	Libros
5	Juguetes
6	Deportes
7	Belleza
8	Alimentos
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (order_id, product_id, quantity, price) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, status, total, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_categories (product_id, category_id) FROM stdin;
1	1
1	2
2	5
3	4
4	7
4	1
5	2
5	5
6	1
6	8
6	2
7	5
7	6
7	8
8	3
8	2
9	2
10	4
11	1
12	2
12	5
12	6
13	4
14	1
14	6
14	7
15	1
15	2
15	3
16	6
16	2
16	8
17	5
17	8
17	7
18	8
18	1
19	5
19	2
20	4
21	8
21	5
21	4
22	3
22	2
22	8
23	1
23	2
23	3
24	4
25	1
25	2
26	4
26	2
27	5
27	7
28	5
28	4
28	3
29	3
30	7
30	6
30	8
31	5
31	6
31	8
32	7
32	6
33	7
33	4
33	8
34	3
34	6
35	3
35	5
35	2
36	6
36	5
36	8
37	7
37	4
37	5
38	6
38	5
38	4
39	5
40	4
40	3
40	2
41	3
41	6
42	3
42	4
42	6
43	6
43	1
43	4
44	1
45	1
45	2
46	4
47	2
47	1
48	6
49	1
49	5
50	4
51	1
51	7
51	5
52	6
53	7
53	1
53	5
54	2
55	6
55	1
56	1
56	2
56	4
57	1
58	1
58	2
59	3
59	8
60	1
61	1
61	2
61	3
62	7
62	2
62	1
63	2
63	4
64	3
64	2
65	4
66	1
66	3
66	7
67	4
68	4
68	5
69	4
69	5
69	6
70	1
71	6
72	4
72	3
73	2
74	3
74	1
75	7
75	2
76	2
76	4
77	1
78	7
78	6
79	2
80	3
80	8
80	2
81	1
81	6
82	3
82	2
83	7
83	1
83	2
84	5
85	4
85	1
85	6
86	5
86	1
87	7
87	1
87	2
88	6
88	5
89	5
90	1
90	6
90	7
91	2
91	3
92	8
93	6
93	5
93	4
94	1
94	4
94	7
95	8
96	5
96	4
97	8
97	1
97	7
98	2
98	4
98	5
99	3
99	2
100	6
100	1
100	8
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_reviews (id, product_id, user_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: product_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_views (id, product_id, user_id, viewed_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, name, description, price, stock, image_url, created_at, updated_at, discount_percentage, rate) FROM stdin;
2	Bespoke Granite Towels	Stylish Gloves designed to make you stand out with monstrous looks	94.49	71	https://picsum.photos/seed/1/300/300	2026-01-13 14:11:32.981921	2026-01-13 14:11:32.981921	9.00	\N
3	Electronic Marble Tuna	Innovative Mouse featuring expert technology and Ceramic construction	105.93	8	https://picsum.photos/seed/2/300/300	2026-01-13 14:11:32.982896	2026-01-13 14:11:32.982896	12.00	\N
4	Small Steel Salad	The sleek and unwieldy Soap comes with green LED lighting for smart functionality	342.24	4	https://picsum.photos/seed/3/300/300	2026-01-13 14:11:32.983488	2026-01-13 14:11:32.983488	27.00	\N
5	Handmade Rubber Pizza	Ergonomic Bacon made with Bamboo for all-day teeming support	25.17	28	https://picsum.photos/seed/4/300/300	2026-01-13 14:11:32.984418	2026-01-13 14:11:32.984418	17.00	\N
6	Fantastic Bronze Sausages	Innovative Pants featuring frail technology and Bronze construction	212.06	9	https://picsum.photos/seed/5/300/300	2026-01-13 14:11:32.9852	2026-01-13 14:11:32.9852	2.00	\N
7	Recycled Plastic Bike	New orchid Chair with ergonomic design for nice comfort	385.65	74	https://picsum.photos/seed/6/300/300	2026-01-13 14:11:32.986731	2026-01-13 14:11:32.986731	15.00	\N
8	Generic Rubber Pants	Featuring Silver-enhanced technology, our Fish offers unparalleled elementary performance	124.06	44	https://picsum.photos/seed/7/300/300	2026-01-13 14:11:32.988437	2026-01-13 14:11:32.988437	30.00	\N
9	Handmade Cotton Bacon	Introducing the Algeria-inspired Soap, blending favorite style with local craftsmanship	26.84	27	https://picsum.photos/seed/8/300/300	2026-01-13 14:11:32.989643	2026-01-13 14:11:32.989643	26.00	\N
10	Frozen Aluminum Cheese	Refined Salad designed with Aluminum for defensive performance	29.35	53	https://picsum.photos/seed/9/300/300	2026-01-13 14:11:32.99047	2026-01-13 14:11:32.99047	9.00	\N
11	Licensed Wooden Chips	The Isabelle Car is the latest in a series of nimble products from Steuber, Grady and Wolf	490.89	82	https://picsum.photos/seed/10/300/300	2026-01-13 14:11:32.991298	2026-01-13 14:11:32.991298	20.00	\N
12	Licensed Marble Chair	Our wolf-friendly Chips ensures sour comfort for your pets	139.95	57	https://picsum.photos/seed/11/300/300	2026-01-13 14:11:32.992326	2026-01-13 14:11:32.992326	10.00	\N
13	Electronic Ceramic Fish	Reynolds, Schmitt and Schaefer's most advanced Tuna technology increases tangible capabilities	164.67	29	https://picsum.photos/seed/12/300/300	2026-01-13 14:11:32.993994	2026-01-13 14:11:32.993994	9.00	\N
14	Elegant Bronze Cheese	Savor the crispy essence in our Tuna, designed for steel culinary adventures	397.37	35	https://picsum.photos/seed/13/300/300	2026-01-13 14:11:32.994618	2026-01-13 14:11:32.994618	3.00	\N
15	Electronic Wooden Keyboard	Innovative Table featuring robust technology and Metal construction	79.35	12	https://picsum.photos/seed/14/300/300	2026-01-13 14:11:32.996106	2026-01-13 14:11:32.996106	8.00	\N
16	Generic Rubber Keyboard	The Camila Mouse is the latest in a series of smooth products from Kris LLC	417.49	90	https://picsum.photos/seed/15/300/300	2026-01-13 14:11:32.99738	2026-01-13 14:11:32.99738	13.00	\N
17	Electronic Granite Table	Tasty Soap designed with Rubber for bouncy performance	475.95	72	https://picsum.photos/seed/16/300/300	2026-01-13 14:11:32.998582	2026-01-13 14:11:32.998582	19.00	\N
18	Handcrafted Granite Keyboard	The red Hat combines Saint Helena aesthetics with Darmstadtium-based durability	36.05	95	https://picsum.photos/seed/17/300/300	2026-01-13 14:11:32.999724	2026-01-13 14:11:32.999724	4.00	\N
19	Gorgeous Bronze Pizza	Daugherty - Kunde's most advanced Gloves technology increases rotating capabilities	330.72	44	https://picsum.photos/seed/18/300/300	2026-01-13 14:11:33.000523	2026-01-13 14:11:33.000523	16.00	\N
20	Small Steel Keyboard	Discover the palatable new Cheese with an exciting mix of Concrete ingredients	480.70	1	https://picsum.photos/seed/19/300/300	2026-01-13 14:11:33.001335	2026-01-13 14:11:33.001335	0.00	\N
21	Fresh Rubber Shirt	Our bee-friendly Gloves ensures quarterly comfort for your pets	118.61	87	https://picsum.photos/seed/20/300/300	2026-01-13 14:11:33.002008	2026-01-13 14:11:33.002008	26.00	\N
22	Oriental Bronze Shoes	New Bacon model with 1 GB RAM, 613 GB storage, and zany features	276.42	30	https://picsum.photos/seed/21/300/300	2026-01-13 14:11:33.003383	2026-01-13 14:11:33.003383	3.00	\N
23	Incredible Concrete Towels	Featuring Silver-enhanced technology, our Computer offers unparalleled intrepid performance	169.49	40	https://picsum.photos/seed/22/300/300	2026-01-13 14:11:33.004878	2026-01-13 14:11:33.004878	25.00	\N
24	Generic Cotton Fish	Innovative Shoes featuring normal technology and Bronze construction	507.77	46	https://picsum.photos/seed/23/300/300	2026-01-13 14:11:33.006075	2026-01-13 14:11:33.006075	6.00	\N
25	Modern Marble Mouse	The Multi-tiered homogeneous methodology Pizza offers reliable performance and musty design	242.25	23	https://picsum.photos/seed/24/300/300	2026-01-13 14:11:33.00678	2026-01-13 14:11:33.00678	0.00	\N
26	Licensed Ceramic Salad	Featuring Chlorine-enhanced technology, our Sausages offers unparalleled soupy performance	71.85	97	https://picsum.photos/seed/25/300/300	2026-01-13 14:11:33.007933	2026-01-13 14:11:33.007933	9.00	\N
27	Sleek Silk Chair	New Chicken model with 66 GB RAM, 681 GB storage, and cumbersome features	488.67	1	https://picsum.photos/seed/26/300/300	2026-01-13 14:11:33.009192	2026-01-13 14:11:33.009192	19.00	\N
28	Fresh Steel Hat	The Timmy Chair is the latest in a series of heavenly products from Prohaska, Volkman and Schmitt	49.14	99	https://picsum.photos/seed/27/300/300	2026-01-13 14:11:33.010365	2026-01-13 14:11:33.010365	7.00	\N
29	Bespoke Aluminum Chicken	New Keyboard model with 46 GB RAM, 615 GB storage, and sudden features	34.56	33	https://picsum.photos/seed/28/300/300	2026-01-13 14:11:33.012134	2026-01-13 14:11:33.012134	4.00	\N
30	Small Rubber Towels	New tan Bacon with ergonomic design for purple comfort	246.68	85	https://picsum.photos/seed/29/300/300	2026-01-13 14:11:33.012813	2026-01-13 14:11:33.012813	3.00	\N
31	Ergonomic Gold Shirt	New blue Soap with ergonomic design for elderly comfort	507.10	28	https://picsum.photos/seed/30/300/300	2026-01-13 14:11:33.014185	2026-01-13 14:11:33.014185	24.00	\N
32	Small Steel Ball	The sleek and motionless Shoes comes with plum LED lighting for smart functionality	185.77	12	https://picsum.photos/seed/31/300/300	2026-01-13 14:11:33.015302	2026-01-13 14:11:33.015302	19.00	\N
33	Frozen Cotton Bacon	Professional-grade Towels perfect for pointed training and recreational use	320.82	69	https://picsum.photos/seed/32/300/300	2026-01-13 14:11:33.016313	2026-01-13 14:11:33.016313	20.00	\N
34	Recycled Cotton Pants	The sleek and stale Soap comes with tan LED lighting for smart functionality	79.12	52	https://picsum.photos/seed/33/300/300	2026-01-13 14:11:33.017271	2026-01-13 14:11:33.017271	18.00	\N
35	Fresh Plastic Chips	Savor the rich essence in our Tuna, designed for unusual culinary adventures	402.54	40	https://picsum.photos/seed/34/300/300	2026-01-13 14:11:33.017983	2026-01-13 14:11:33.017983	27.00	\N
36	Incredible Bronze Mouse	Innovative Towels featuring nocturnal technology and Ceramic construction	155.35	93	https://picsum.photos/seed/35/300/300	2026-01-13 14:11:33.018934	2026-01-13 14:11:33.018934	13.00	\N
37	Refined Concrete Towels	The Horizontal dynamic definition Cheese offers reliable performance and damaged design	389.94	71	https://picsum.photos/seed/36/300/300	2026-01-13 14:11:33.019876	2026-01-13 14:11:33.019876	16.00	\N
38	Bespoke Ceramic Hat	Professional-grade Bacon perfect for deserted training and recreational use	348.90	72	https://picsum.photos/seed/37/300/300	2026-01-13 14:11:33.02081	2026-01-13 14:11:33.02081	29.00	\N
39	Bespoke Cotton Gloves	The Total actuating concept Hat offers reliable performance and worldly design	508.04	53	https://picsum.photos/seed/38/300/300	2026-01-13 14:11:33.021912	2026-01-13 14:11:33.021912	3.00	\N
40	Handcrafted Marble Gloves	Our moist-inspired Bacon brings a taste of luxury to your metallic lifestyle	305.26	91	https://picsum.photos/seed/39/300/300	2026-01-13 14:11:33.022306	2026-01-13 14:11:33.022306	4.00	\N
41	Small Aluminum Bike	The Raheem Bacon is the latest in a series of sturdy products from Dach - Kirlin	303.63	8	https://picsum.photos/seed/40/300/300	2026-01-13 14:11:33.023001	2026-01-13 14:11:33.023001	7.00	\N
42	Frozen Rubber Bike	Our zesty-inspired Mouse brings a taste of luxury to your shabby lifestyle	296.87	78	https://picsum.photos/seed/41/300/300	2026-01-13 14:11:33.023541	2026-01-13 14:11:33.023541	20.00	\N
43	Intelligent Metal Tuna	Ziemann - Gleichner's most advanced Pants technology increases willing capabilities	313.52	72	https://picsum.photos/seed/42/300/300	2026-01-13 14:11:33.024311	2026-01-13 14:11:33.024311	24.00	\N
44	Oriental Steel Car	Stylish Chair designed to make you stand out with able looks	206.84	71	https://picsum.photos/seed/43/300/300	2026-01-13 14:11:33.025036	2026-01-13 14:11:33.025036	5.00	\N
45	Small Aluminum Gloves	Innovative Car featuring unique technology and Marble construction	392.97	59	https://picsum.photos/seed/44/300/300	2026-01-13 14:11:33.02541	2026-01-13 14:11:33.02541	13.00	\N
46	Fantastic Rubber Car	Discover the finished new Ball with an exciting mix of Silk ingredients	107.64	32	https://picsum.photos/seed/45/300/300	2026-01-13 14:11:33.025918	2026-01-13 14:11:33.025918	14.00	\N
47	Recycled Bamboo Shoes	Discover the lion-like agility of our Towels, perfect for tiny users	274.33	80	https://picsum.photos/seed/46/300/300	2026-01-13 14:11:33.02648	2026-01-13 14:11:33.02648	22.00	\N
48	Luxurious Gold Bike	Savor the spicy essence in our Shoes, designed for pink culinary adventures	186.72	43	https://picsum.photos/seed/47/300/300	2026-01-13 14:11:33.027079	2026-01-13 14:11:33.027079	30.00	\N
49	Electronic Metal Cheese	The sleek and self-assured Hat comes with tan LED lighting for smart functionality	176.64	98	https://picsum.photos/seed/48/300/300	2026-01-13 14:11:33.027435	2026-01-13 14:11:33.027435	20.00	\N
50	Elegant Metal Towels	Professional-grade Shirt perfect for narrow training and recreational use	284.15	6	https://picsum.photos/seed/49/300/300	2026-01-13 14:11:33.02793	2026-01-13 14:11:33.02793	8.00	\N
51	Refined Gold Shoes	The azure Shoes combines Belgium aesthetics with Praseodymium-based durability	146.43	7	https://picsum.photos/seed/50/300/300	2026-01-13 14:11:33.028312	2026-01-13 14:11:33.028312	15.00	\N
52	Fantastic Rubber Ball	Experience the plum brilliance of our Keyboard, perfect for trustworthy environments	119.15	82	https://picsum.photos/seed/51/300/300	2026-01-13 14:11:33.028984	2026-01-13 14:11:33.028984	2.00	\N
53	Oriental Steel Computer	New mint green Mouse with ergonomic design for faint comfort	401.69	90	https://picsum.photos/seed/52/300/300	2026-01-13 14:11:33.029332	2026-01-13 14:11:33.029332	19.00	\N
54	Unbranded Aluminum Pants	Our fresh-inspired Computer brings a taste of luxury to your misguided lifestyle	123.42	56	https://picsum.photos/seed/53/300/300	2026-01-13 14:11:33.030041	2026-01-13 14:11:33.030041	19.00	\N
55	Incredible Steel Chicken	Discover the wolf-like agility of our Computer, perfect for spotless users	428.69	62	https://picsum.photos/seed/54/300/300	2026-01-13 14:11:33.030385	2026-01-13 14:11:33.030385	10.00	\N
56	Intelligent Bronze Fish	Bespoke Bike designed with Gold for rundown performance	144.26	27	https://picsum.photos/seed/55/300/300	2026-01-13 14:11:33.030876	2026-01-13 14:11:33.030876	5.00	\N
57	Ergonomic Ceramic Fish	Our dog-friendly Shoes ensures stunning comfort for your pets	240.87	24	https://picsum.photos/seed/56/300/300	2026-01-13 14:11:33.031562	2026-01-13 14:11:33.031562	2.00	\N
58	Modern Metal Tuna	Stylish Car designed to make you stand out with cavernous looks	366.05	58	https://picsum.photos/seed/57/300/300	2026-01-13 14:11:33.031894	2026-01-13 14:11:33.031894	14.00	\N
59	Handmade Bronze Salad	Our bird-friendly Fish ensures staid comfort for your pets	321.63	77	https://picsum.photos/seed/58/300/300	2026-01-13 14:11:33.03246	2026-01-13 14:11:33.03246	22.00	\N
60	Sleek Cotton Shirt	New Pizza model with 29 GB RAM, 77 GB storage, and lustrous features	422.89	77	https://picsum.photos/seed/59/300/300	2026-01-13 14:11:33.033043	2026-01-13 14:11:33.033043	28.00	\N
61	Tasty Bamboo Keyboard	Discover the ironclad new Soap with an exciting mix of Plastic ingredients	50.78	50	https://picsum.photos/seed/60/300/300	2026-01-13 14:11:33.033381	2026-01-13 14:11:33.033381	5.00	\N
62	Ergonomic Concrete Hat	Featuring Radium-enhanced technology, our Pants offers unparalleled flustered performance	79.05	22	https://picsum.photos/seed/61/300/300	2026-01-13 14:11:33.034026	2026-01-13 14:11:33.034026	19.00	\N
63	Sleek Plastic Table	Innovative Car featuring authorized technology and Concrete construction	479.49	56	https://picsum.photos/seed/62/300/300	2026-01-13 14:11:33.034673	2026-01-13 14:11:33.034673	5.00	\N
64	Fresh Cotton Salad	Professional-grade Table perfect for secondary training and recreational use	416.58	84	https://picsum.photos/seed/63/300/300	2026-01-13 14:11:33.035156	2026-01-13 14:11:33.035156	12.00	\N
65	Refined Ceramic Bike	Featuring Molybdenum-enhanced technology, our Bike offers unparalleled shameful performance	33.77	51	https://picsum.photos/seed/64/300/300	2026-01-13 14:11:33.03568	2026-01-13 14:11:33.03568	29.00	\N
66	Elegant Steel Pizza	Cummings, Yundt and Wehner's most advanced Shirt technology increases superficial capabilities	281.24	75	https://picsum.photos/seed/65/300/300	2026-01-13 14:11:33.036294	2026-01-13 14:11:33.036294	13.00	\N
67	Unbranded Wooden Chicken	New ivory Chair with ergonomic design for delicious comfort	14.34	18	https://picsum.photos/seed/66/300/300	2026-01-13 14:11:33.036998	2026-01-13 14:11:33.036998	25.00	\N
68	Fresh Aluminum Tuna	Sleek Chips designed with Cotton for zealous performance	33.27	97	https://picsum.photos/seed/67/300/300	2026-01-13 14:11:33.037433	2026-01-13 14:11:33.037433	3.00	\N
69	Ergonomic Silk Bacon	Handcrafted Chicken designed with Bamboo for french performance	403.15	42	https://picsum.photos/seed/68/300/300	2026-01-13 14:11:33.037996	2026-01-13 14:11:33.037996	9.00	\N
70	Recycled Ceramic Mouse	Savor the golden essence in our Cheese, designed for calculating culinary adventures	445.43	8	https://picsum.photos/seed/69/300/300	2026-01-13 14:11:33.038711	2026-01-13 14:11:33.038711	26.00	\N
71	Rustic Wooden Shirt	Featuring Polonium-enhanced technology, our Sausages offers unparalleled grounded performance	139.23	70	https://picsum.photos/seed/70/300/300	2026-01-13 14:11:33.039104	2026-01-13 14:11:33.039104	17.00	\N
72	Fresh Marble Shirt	Our savory-inspired Towels brings a taste of luxury to your gullible lifestyle	448.11	35	https://picsum.photos/seed/71/300/300	2026-01-13 14:11:33.039459	2026-01-13 14:11:33.039459	12.00	\N
73	Refined Silk Chair	Innovative Cheese featuring acceptable technology and Wooden construction	450.67	3	https://picsum.photos/seed/72/300/300	2026-01-13 14:11:33.040012	2026-01-13 14:11:33.040012	24.00	\N
74	Bespoke Granite Chips	New Pizza model with 62 GB RAM, 774 GB storage, and soggy features	42.71	85	https://picsum.photos/seed/73/300/300	2026-01-13 14:11:33.040494	2026-01-13 14:11:33.040494	2.00	\N
75	Handcrafted Rubber Pants	Discover the gecko-like agility of our Bacon, perfect for calculating users	88.90	12	https://picsum.photos/seed/74/300/300	2026-01-13 14:11:33.041064	2026-01-13 14:11:33.041064	27.00	\N
76	Fantastic Wooden Keyboard	The Devolved client-server collaboration Car offers reliable performance and plump design	348.19	42	https://picsum.photos/seed/75/300/300	2026-01-13 14:11:33.041667	2026-01-13 14:11:33.041667	29.00	\N
77	Licensed Wooden Salad	Innovative Salad featuring total technology and Wooden construction	290.68	99	https://picsum.photos/seed/76/300/300	2026-01-13 14:11:33.042307	2026-01-13 14:11:33.042307	8.00	\N
78	Luxurious Concrete Towels	The Triple-buffered mission-critical process improvement Cheese offers reliable performance and whirlwind design	20.75	67	https://picsum.photos/seed/77/300/300	2026-01-13 14:11:33.042731	2026-01-13 14:11:33.042731	14.00	\N
79	Bespoke Steel Fish	The sleek and tedious Mouse comes with lime LED lighting for smart functionality	173.96	20	https://picsum.photos/seed/78/300/300	2026-01-13 14:11:33.04331	2026-01-13 14:11:33.04331	27.00	\N
80	Oriental Rubber Ball	Professional-grade Car perfect for secret training and recreational use	405.44	37	https://picsum.photos/seed/79/300/300	2026-01-13 14:11:33.043695	2026-01-13 14:11:33.043695	16.00	\N
81	Recycled Ceramic Mouse	Stylish Shirt designed to make you stand out with handy looks	358.83	38	https://picsum.photos/seed/80/300/300	2026-01-13 14:11:33.044421	2026-01-13 14:11:33.044421	1.00	\N
82	Practical Rubber Mouse	Professional-grade Soap perfect for whopping training and recreational use	417.01	51	https://picsum.photos/seed/81/300/300	2026-01-13 14:11:33.044978	2026-01-13 14:11:33.044978	25.00	\N
83	Handmade Ceramic Ball	Professional-grade Keyboard perfect for sniveling training and recreational use	181.79	91	https://picsum.photos/seed/82/300/300	2026-01-13 14:11:33.045507	2026-01-13 14:11:33.045507	9.00	\N
84	Fantastic Plastic Shoes	Innovative Table featuring our technology and Bronze construction	263.81	27	https://picsum.photos/seed/83/300/300	2026-01-13 14:11:33.046239	2026-01-13 14:11:33.046239	27.00	\N
85	Handcrafted Ceramic Gloves	Featuring Osmium-enhanced technology, our Towels offers unparalleled sophisticated performance	477.05	52	https://picsum.photos/seed/84/300/300	2026-01-13 14:11:33.04686	2026-01-13 14:11:33.04686	29.00	\N
86	Awesome Aluminum Computer	Professional-grade Pizza perfect for shy training and recreational use	224.32	25	https://picsum.photos/seed/85/300/300	2026-01-13 14:11:33.047561	2026-01-13 14:11:33.047561	2.00	\N
87	Soft Bronze Chair	Innovative Bike featuring expert technology and Steel construction	113.82	47	https://picsum.photos/seed/86/300/300	2026-01-13 14:11:33.048092	2026-01-13 14:11:33.048092	20.00	\N
88	Licensed Concrete Towels	Innovative Shirt featuring scratchy technology and Cotton construction	430.30	21	https://picsum.photos/seed/87/300/300	2026-01-13 14:11:33.048823	2026-01-13 14:11:33.048823	30.00	\N
89	Licensed Marble Cheese	Discover the enchanting new Towels with an exciting mix of Aluminum ingredients	52.00	40	https://picsum.photos/seed/88/300/300	2026-01-13 14:11:33.049355	2026-01-13 14:11:33.049355	24.00	\N
90	Awesome Cotton Ball	New Computer model with 88 GB RAM, 270 GB storage, and doting features	416.08	56	https://picsum.photos/seed/89/300/300	2026-01-13 14:11:33.049885	2026-01-13 14:11:33.049885	6.00	\N
91	Ergonomic Aluminum Ball	Stylish Chicken designed to make you stand out with admired looks	166.60	66	https://picsum.photos/seed/90/300/300	2026-01-13 14:11:33.050545	2026-01-13 14:11:33.050545	2.00	\N
92	Tasty Ceramic Fish	Experience the turquoise brilliance of our Chips, perfect for cavernous environments	192.21	50	https://picsum.photos/seed/91/300/300	2026-01-13 14:11:33.051108	2026-01-13 14:11:33.051108	20.00	\N
93	Rustic Wooden Gloves	Conroy, Abbott and Bradtke's most advanced Hat technology increases dental capabilities	426.82	43	https://picsum.photos/seed/92/300/300	2026-01-13 14:11:33.051448	2026-01-13 14:11:33.051448	27.00	\N
94	Unbranded Ceramic Table	Innovative Salad featuring slimy technology and Marble construction	197.47	40	https://picsum.photos/seed/93/300/300	2026-01-13 14:11:33.052116	2026-01-13 14:11:33.052116	24.00	\N
95	Fantastic Steel Bike	Veum - Leffler's most advanced Shirt technology increases direct capabilities	470.12	82	https://picsum.photos/seed/94/300/300	2026-01-13 14:11:33.052802	2026-01-13 14:11:33.052802	19.00	\N
96	Fantastic Metal Salad	Savor the spicy essence in our Hat, designed for excited culinary adventures	152.62	69	https://picsum.photos/seed/95/300/300	2026-01-13 14:11:33.053173	2026-01-13 14:11:33.053173	2.00	\N
97	Incredible Bronze Cheese	New Car model with 52 GB RAM, 778 GB storage, and dutiful features	310.43	60	https://picsum.photos/seed/96/300/300	2026-01-13 14:11:33.053739	2026-01-13 14:11:33.053739	20.00	\N
98	Oriental Steel Chips	Featuring Arsenic-enhanced technology, our Sausages offers unparalleled outgoing performance	198.47	63	https://picsum.photos/seed/97/300/300	2026-01-13 14:11:33.054425	2026-01-13 14:11:33.054425	10.00	\N
99	Soft Plastic Bacon	The Serenity Car is the latest in a series of creamy products from Gutkowski - Watsica	30.01	64	https://picsum.photos/seed/98/300/300	2026-01-13 14:11:33.055126	2026-01-13 14:11:33.055126	20.00	\N
100	Fresh Steel Salad	Savor the smoky essence in our Bacon, designed for scaly culinary adventures	337.60	45	https://picsum.photos/seed/99/300/300	2026-01-13 14:11:33.055642	2026-01-13 14:11:33.055642	10.00	\N
101	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 22:59:37.256268	2026-01-13 22:59:37.256268	0.00	\N
103	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 23:14:46.517651	2026-01-13 23:14:46.517651	0.00	\N
115	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:40:07.361114	2026-01-19 23:40:07.361114	0.00	\N
105	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 23:15:27.390501	2026-01-13 23:15:27.390501	0.00	\N
107	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 23:15:33.078656	2026-01-13 23:15:33.078656	0.00	\N
119	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:44:33.480569	2026-01-19 23:44:33.480569	0.00	\N
109	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 23:16:09.33435	2026-01-13 23:16:09.33435	0.00	\N
111	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-13 23:23:49.208682	2026-01-13 23:23:49.208682	0.00	\N
113	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:28:38.998135	2026-01-19 23:28:38.998135	0.00	\N
123	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:48:47.104479	2026-01-19 23:48:47.104479	0.00	\N
117	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:41:56.200042	2026-01-19 23:41:56.200042	0.00	\N
121	Webcam HD	Webcam 1080p	59.99	20	/default	2026-01-19 23:47:22.891762	2026-01-19 23:47:22.891762	0.00	\N
1	Awesome Cotton Car	Stylish Chair designed to make you stand out with educated looks	899.99	5	https://picsum.photos/seed/0/300/300	2026-01-13 14:11:32.979456	2026-01-19 23:48:47.186005	14.00	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name) FROM stdin;
1	cliente
2	admin
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, created_at, role_id) FROM stdin;
1	Admin User	admin@test.com	$2a$10$DMUdnIlIwzx8hnTa7LmSUebMJEUre4LnY3shZqDjbWqM3pQdHpZZi	2026-01-13 14:11:32.210892	2
2	Test User	user@test.com	$2a$10$M8LVbgG3aq1ZENxAMNGfueYIUOnYzYCnkxutuRycw7zhQEDjG.v.2	2026-01-13 14:11:32.2828	1
3	Bob Wilkinson	Tyrell_Olson49@yahoo.com	$2a$10$fXUDSGIYofdfRP7lFyT7PeeHejoOHNliddKpMWfEVrFNv3YQmWtnS	2026-01-13 14:11:32.353391	1
4	Curtis Kuhlman	Laney_Feil26@yahoo.com	$2a$10$OS5oDGOlLrXbEElnqaCxMe2TsKME5Qqwb.AL6GjDvS0cd3hqGIF96	2026-01-13 14:11:32.42259	1
5	Melanie Reichel	Sammie_Waelchi47@gmail.com	$2a$10$dia3HT9Mu/yad4/YiWupO.1cgv7HyRgLV76W9gOZr3R6jJ7HegNbK	2026-01-13 14:11:32.491366	1
6	Stewart Harber	Colten_Mraz@yahoo.com	$2a$10$Qu3bMdPvLe5xSDDgezysAuOi06xLK9zy4JIh.724PDHlWnZgdlf4O	2026-01-13 14:11:32.559649	1
7	Krista Sanford	Raquel_Watsica@gmail.com	$2a$10$Rp2zA8cPWZUzUEdjpymE7.6bJ2A.m9zNOAxafSok9PWPuunf.tVk.	2026-01-13 14:11:32.628808	1
8	Molly Hauck	Karlee_Kling-Harvey27@yahoo.com	$2a$10$1gGok9892wtBpV0OBBC1GODgt1TVM3OxlFXjJraGfted8EDaDVqr2	2026-01-13 14:11:32.697604	1
9	Hugh Waters	Ellie95@hotmail.com	$2a$10$ImROzZuLBPRVyijRml4/FOCaC0QQzpRtVPx2lVqDPOfRBDvLdoSHi	2026-01-13 14:11:32.766578	1
10	Iris Blanda	Conor7@hotmail.com	$2a$10$ZDq0sx46CSmvacoOsRHZ0exR.cWG7SVHSiKLEL.JZqYDK.HrYVghm	2026-01-13 14:11:32.835175	1
11	Estelle Funk	Aracely.Nolan53@hotmail.com	$2a$10$Qf.jEn2ycRyNwJZ8VF2cNuAdN0MKBOsSa5nzfd2xMv7WLWGjfLG26	2026-01-13 14:11:32.904071	1
12	Audrey Homenick	Eleanora_Marquardt@hotmail.com	$2a$10$gh9cvegZzdZUsPVV7cjBRu5JPPFWwirFFr8FD9U6v6ZuOaarVj/ce	2026-01-13 14:11:32.973964	1
13	Sebastian	sebatapiareb@gmail.com	$2a$10$YbiaDOFU5HnNGsXzjRv.gewm8ZKRw4T/CwVhEHRzwGZRTlIe0gdYa	2026-01-13 18:31:46.18	1
14	Cart User	cartuser1768327997982@test.com	$2a$10$8/e5EoqMUTn8aQhm/wAu0OmBUicM.QRwUVKzvTrfeqYlJSV36K05u	2026-01-13 19:13:18.101	1
15	Cart User	cartuser1768335364035@test.com	$2a$10$RHhR92NPwUeeloPjOK6TJerIckZqZK4utl.s65JckcYb1i0.DoFD2	2026-01-13 21:16:04.149	1
16	Cart User	cartuser1768335536680@test.com	$2a$10$xALSeaLbpfF/Y7xZJ0FipO1cFQz4CAMFtmScRwKV33b47pLwJ97bq	2026-01-13 21:18:56.792	1
17	Marcela	marcela@mail.com	$2a$10$fajpuNczVpIZygi.qE.Z9uJyk6SpCVQXNqPhp5oxT6e2g9wmYoXGe	2026-01-14 00:10:23.15	1
18	New User	newuser1768351306736@test.com	$2a$10$RaIS2sKWrL54Cg7Wlkzhnuf7B9b0D3O3eQfx6JkN8jPn/n7YL6CMa	2026-01-14 01:41:46.848	1
19	Test	duplicate1768351306862@test.com	$2a$10$rIydtZxaGujGt0dAo29r1.h9mFQxeUiVWYOTHgii/OtgFHyxV1KFS	2026-01-14 01:41:46.933	1
20	Login User	user1768351306939@test.com	$2a$10$JbBncU4EQIZPwpEOd.lyZ.o4x7H3GkSgdmvhg0A8C3WrR5kPNTN5.	2026-01-14 01:41:47.008	1
21	Login User	user1768351307084@test.com	$2a$10$uM3Fp/p0E00C8yBjAFXEEOsiELC0Bmxjp/BS3LHy9BHc3phn5XyOG	2026-01-14 01:41:47.153	1
22	Login User	user1768351307225@test.com	$2a$10$8uYND98vI4ixOI19Upa/SuURhtv.PpHvXKJc9h3ej3QMq/JMgc.rm	2026-01-14 01:41:47.295	1
23	New User	newuser1768351449260@test.com	$2a$10$5L1L6MA2R1/Tf/hOPCiBcukW7cUl6DSYUYdA.9JLWP8Ce9IjaC8s6	2026-01-14 01:44:09.372	1
24	Test	duplicate1768351449385@test.com	$2a$10$PLt32hFYyB8m7RA7GNr32ex3dnEM18yI8FV0Su4OttkubtdQIm.TG	2026-01-14 01:44:09.456	1
25	Login User	user1768351449462@test.com	$2a$10$Dzol64hQ7I/USqMqsTbH4u98gTEcLKiF6YAXujhfWRSwNTdTa3q6y	2026-01-14 01:44:09.532	1
26	Login User	user1768351449607@test.com	$2a$10$m4IMroH9q/eRJvSbMJUcw.M1JPGhPtvq3rgJ8mdJH3sucMU/XOyGC	2026-01-14 01:44:09.677	1
27	Login User	user1768351449751@test.com	$2a$10$ok5j1JIhD6Xy8KD3YpjSTu4uIEhKZW3Dz2XXXIO7UT1hjQBc./Lxq	2026-01-14 01:44:09.822	1
28	New User	newuser1768351513645@test.com	$2a$10$nOYGNVsEka55bhlsHnPYkewmlxszduYBrmcJfGvb44zB/Pu3k1NNi	2026-01-14 01:45:13.802	1
29	Test	duplicate1768351513817@test.com	$2a$10$JUm1XzqZxVbgDRYU9abjseyo1iJvUS2b6XsSZWyMvGwtt9./gSgP6	2026-01-14 01:45:13.888	1
30	Login User	user1768351513894@test.com	$2a$10$gc75kMQRLYDvrtNrMRVGvO7rdBpHfCEPQzt5oivXPB5qQxLd4EfCG	2026-01-14 01:45:13.965	1
31	Login User	user1768351514040@test.com	$2a$10$5YY9TD//WhQI6xp/ZgdAr.w7sgTH2L4fnLH77Lbjbeio.33INpMju	2026-01-14 01:45:14.111	1
32	Login User	user1768351514184@test.com	$2a$10$9mhsenlryTqa2Axoms0sLuWUe5I0teiM2oD51QfoWh1wF/z5f2iWK	2026-01-14 01:45:14.255	1
33	New User	newuser1768353832026@test.com	$2a$10$LkA4O3L8RWX3mH8xBTbK7edQVsZJNe8QC3x/Mh.n80BTqFh6k.EYm	2026-01-14 02:23:52.142	1
34	Test	duplicate1768353832159@test.com	$2a$10$7YWnD2sLRL2Zf.sk2vLlSOaJDp7YUtC0Tjh4MzaoJKpqXCIGYuZXi	2026-01-14 02:23:52.235	1
35	Login User	user1768353832245@test.com	$2a$10$676J6/bZMrtYg7mGuGtNCuB06hfjGYIWlME/jnLVkzrIQ0CC6svBW	2026-01-14 02:23:52.316	1
36	Login User	user1768353832407@test.com	$2a$10$XjyweRVmjFc2kuaJ4beOBO5VQEJKzA83So4N3mPpperdUVYl20i52	2026-01-14 02:23:52.478	1
37	Login User	user1768353832554@test.com	$2a$10$PmrG30FiOgo6BSwNavDkGugY2R3yfh8J2M8UBayweKMTymYfWHKTS	2026-01-14 02:23:52.626	1
38	New User	newuser1768353879419@test.com	$2a$10$deGQGahACodixFOEWfU2.ejwKY0E7pkMJr65IeAdQF6TKCWIRRdga	2026-01-14 02:24:39.526	1
39	Test	duplicate1768353879543@test.com	$2a$10$DOSsSaENjxCqHwX.rYB/HeSPLu/NErDjFjyRm5ayT6eMJ4aZ0YYkK	2026-01-14 02:24:39.615	1
40	Login User	user1768353879623@test.com	$2a$10$3BN4eT3/3hl9KUTQoP3Ese23PiIbFs1SvuwkwHpkCjCcXz362kArO	2026-01-14 02:24:39.716	1
41	Login User	user1768353879807@test.com	$2a$10$ejF//bkUuPm/XwsqI1FfjODvw.JcVElpDLH/Ow9aGD3bLXBzQZq.S	2026-01-14 02:24:39.878	1
42	Login User	user1768353879953@test.com	$2a$10$.CDYj/l1u4j.1phEpLODk.1SrsTCkoJAT2moLxTaIlUkUaVPbHASi	2026-01-14 02:24:40.024	1
43	New User	newuser1768353996329@test.com	$2a$10$Ow6zYHagdaS/zzdRLL6j8eFUp/wJEXfp7KcPrSxgATvh1Et.o1EoG	2026-01-14 02:26:36.44	1
44	Test	duplicate1768353996453@test.com	$2a$10$kMWGMPGgnTtPqmGkmx8uae1fqzxU/6DZq44AN9bUZkWeC562A8zt6	2026-01-14 02:26:36.527	1
45	Login User	user1768353996534@test.com	$2a$10$Zr/nglcDbq8M8X/bVNDsR.ekJcJTLk0sOAuKVk5r4znoWx9ufe/zC	2026-01-14 02:26:36.605	1
46	Login User	user1768353996697@test.com	$2a$10$fP.Gk.G5LRAPf86TDung.uohAjbWm2skyq4UwGabpedrASKjaYmxC	2026-01-14 02:26:36.767	1
47	Login User	user1768353996843@test.com	$2a$10$YeI8jPwii.beV.G8vRZZd.aMCQYU6guH6QAVkK0oojiUrthmb.BoG	2026-01-14 02:26:36.939	1
48	New User	newuser1768354173361@test.com	$2a$10$Zd9qqhslzKc7CNg2U/l4RePsb5aytV9rE4dbLEj.kNj0vBPYmeAR.	2026-01-14 02:29:33.477	1
49	Test	duplicate1768354173490@test.com	$2a$10$rAM1r0IjjL4m.UTNa62dpunpJ.FgOhKHBd0CcBuBuTZsQMjVz6zE6	2026-01-14 02:29:33.561	1
50	Login User	user1768354173568@test.com	$2a$10$MaIcE9mZkC5v2siBGyhgvuCFKxTNjugDwkkAsGXd4pV3srKCqMK3W	2026-01-14 02:29:33.637	1
51	Login User	user1768354173728@test.com	$2a$10$13yjz4/lFTscBNF8UUsYZe63GjA8pbwogJXAnyHjY/VOHV.p2jf8u	2026-01-14 02:29:33.798	1
52	Login User	user1768354173871@test.com	$2a$10$9X7BVBMNlSCNT3m51aV92.jDxmYqmpflVeqzc7IOOa0I7ayH11CBu	2026-01-14 02:29:33.941	1
53	New User	newuser1768354198652@test.com	$2a$10$1UNf2.xVsaVYrkyCXLjZUO5G5JLjmrvFtQPOZ2APS21Ebuf3404X6	2026-01-14 02:29:58.761	1
54	Test	duplicate1768354198774@test.com	$2a$10$MXCvCKjnawaqlCoT6pVybutaBuh7MrWvMAWqHPhXdcpHRL8A7vJla	2026-01-14 02:29:58.845	1
55	Login User	user1768354198852@test.com	$2a$10$aFF4G/wjgTibjt/.bYoc3ObRo3XL2IPM7wW2A7x6bllryS.1BCL3G	2026-01-14 02:29:58.922	1
56	Login User	user1768354199015@test.com	$2a$10$IkB.cMF1jXc4wjy1SsC5T.uqmdxyq7veSypxgz5JORek896Y1eNKu	2026-01-14 02:29:59.085	1
57	Login User	user1768354199159@test.com	$2a$10$MdF.BjiTge6cPyxB2HV.T.Q8qhA89/vIjgVqAOLxJ1Ox9EQY1Lorq	2026-01-14 02:29:59.23	1
58	New User	newuser1768354205106@test.com	$2a$10$yFrLQLORJg5fQx.21tKdj.YvvPy11YJhcQ/wZRAnVSXVL4SD/0z66	2026-01-14 02:30:05.21	1
59	Test	duplicate1768354205221@test.com	$2a$10$x12SSVRjcuKwyHO0teeip.ylIeryv4cyenhf9.ilEbfa6YCeybynq	2026-01-14 02:30:05.295	1
60	Login User	user1768354205300@test.com	$2a$10$ruJIw3dvuvtcDnR/11NGj.XaigTD8Omr.hO.TRjpNFDYyz/rWccqu	2026-01-14 02:30:05.373	1
61	Login User	user1768354205464@test.com	$2a$10$EocF4Wp.WMwnG1MLCmFOBOZCWxhzhOa4VujDfvNgqrp6wCq6XQ.lK	2026-01-14 02:30:05.534	1
62	Login User	user1768354205608@test.com	$2a$10$hJPoou8wa7LCR42pSAewfu6THDp3QYqLpG80HZrgJtXKI8caKwspq	2026-01-14 02:30:05.678	1
63	New User	newuser1768354363213@test.com	$2a$10$c9pohyb6dnNd8YuyD0iiT.zsKGNCGomxUWdG1M.mMsuNOD0LTqPeC	2026-01-14 02:32:43.323	1
64	Test	duplicate1768354363336@test.com	$2a$10$cvPyCexHuqCsfKFgYtGb5.KA7IUHCEoYVrSfHuzTxLIh5tL1Ts/z2	2026-01-14 02:32:43.408	1
65	Login User	user1768354363414@test.com	$2a$10$8/zmlWDozB1MGIEFZVGzmeoN3vEQHivPmgM/VqAsFHmSAuNW1CHp6	2026-01-14 02:32:43.483	1
66	Login User	user1768354363572@test.com	$2a$10$A0s5vO1MaJRTXgArYKhtIesHM85AXZXcKQt1n2I5nhZgKO7ewUC/e	2026-01-14 02:32:43.642	1
67	Login User	user1768354363715@test.com	$2a$10$CQJk2rhGJ6D3RbDynD/WiunpQMhEvg6P3Q2ZGsQKliftnT9l/tOKK	2026-01-14 02:32:43.784	1
68	New User	newuser1768355976262@test.com	$2a$10$S2s3WqHG84LMd9FP1kzF9eXajTjI4t.Fa46dC9kJ3wA3.WJUOc52i	2026-01-14 02:59:36.376	1
69	Test	duplicate1768355976390@test.com	$2a$10$2.1kNGr51zmcs6wBJr.bIeyGW/7HSdWU4Gj8MO7xGytpJR20dFgra	2026-01-14 02:59:36.465	1
70	Login User	user1768355976471@test.com	$2a$10$Jn4lNKBVeh2zFrNOVUAlFuxdr7kpe7FKnitwdihgNBciSipASFSue	2026-01-14 02:59:36.54	1
71	Login User	user1768355976629@test.com	$2a$10$8x4WAlyZGUGk2kgqp3DXt.2oN1RqSy2rQfmgYc3eHwdZIpcIuaIqe	2026-01-14 02:59:36.698	1
72	Login User	user1768355976772@test.com	$2a$10$F9o0au5jfPcIgbuiq8.FxeVojXTfT9SCe8.56cJ2yQLPfkDW4O.OG	2026-01-14 02:59:36.842	1
73	Cart User	cartuser1768355976914@test.com	$2a$10$42b8a60SQ7jv/9kCredlnOzjgBHcEyFdUBeTSbCHdlA6P2lkiws9a	2026-01-14 02:59:37	1
74	New User	newuser1768356885740@test.com	$2a$10$CyGOcoQvxzNQtVaJJoffI.6L3Vd/nz7oh8RRXZRhOUaoPIfNYVycS	2026-01-14 03:14:45.849	1
75	Test	duplicate1768356885862@test.com	$2a$10$Eud.L/A5pxls8VYQEy8t2.KA/ymwzJA6uHcx7FU2kVcla0ud6w7w2	2026-01-14 03:14:45.934	1
76	Login User	user1768356885940@test.com	$2a$10$ihxnm1OlhVwZlNPXcsFuseKAXMUJO13uYBVWLnjiC6L3S5TS0OI3i	2026-01-14 03:14:46.01	1
77	Login User	user1768356886101@test.com	$2a$10$6fhj8Vy9mb58jGpeaYyjY.hJiz2b3V39kl5pnkrkc38eLcPSOj4tS	2026-01-14 03:14:46.17	1
78	Login User	user1768356886245@test.com	$2a$10$ACnz2VjxeXjY0DWUS11KveDD69WIkYRbVQ6ocssg3isyOtKw0SGCW	2026-01-14 03:14:46.315	1
79	Cart User	cartuser1768356886799@test.com	$2a$10$zyBMdp4gPeVF7t5EF.uMO.ISD9r5h9OKza/vOWEMH.h4Ra1RFe.u2	2026-01-14 03:14:46.881	1
80	New User	newuser1768356926625@test.com	$2a$10$3A6kcCBns/RcDaee3czsu.Wl/g4GZQIGcG.quN6e.NSl3mMVdouwC	2026-01-14 03:15:26.737	1
81	Test	duplicate1768356926749@test.com	$2a$10$31jTHC588KR5R9uHG2faSuiQCY.B9lNpk6/bXo2HJ2uNUlrRDnPiS	2026-01-14 03:15:26.821	1
82	Login User	user1768356926828@test.com	$2a$10$OQxHyKJ0z0puC.sXAa5yIOqUa4NAvuilqL6RLN0R3x9s3/cSDloB2	2026-01-14 03:15:26.897	1
83	Login User	user1768356926987@test.com	$2a$10$kAq3b1M0hL5pzL8y7vruWucn3pf/FXu424P6cUNxq0d7Fl68eMLiK	2026-01-14 03:15:27.057	1
84	Login User	user1768356927130@test.com	$2a$10$.Sz2i7e1wGAqC.Kp21ual.UR.iQNmTixnPpJOyV.YEQXtCpbFhSfa	2026-01-14 03:15:27.2	1
85	Cart User	cartuser1768356927598@test.com	$2a$10$z.78AwhqEfOfC3QMmNYx5O4KZ7Iuz/k3lXqBhCmTPvLqyCMqWu0/2	2026-01-14 03:15:27.683	1
86	New User	newuser1768356932320@test.com	$2a$10$C.h/b/QpZXafCpifsI7brO4Cq6N684PMD.aPw6NYoBVuhTcwZ.C7S	2026-01-14 03:15:32.428	1
87	Test	duplicate1768356932441@test.com	$2a$10$d64toTAEAQds94xcVBv5FezzQXUljE7R18YCon4ZnfGlKEGTLBzXe	2026-01-14 03:15:32.512	1
88	Login User	user1768356932519@test.com	$2a$10$LTZTnR.W99SvXEntY4fXGu1xyiQGccf0YsiVlklr0w9vv9LQGuBCm	2026-01-14 03:15:32.59	1
89	Login User	user1768356932680@test.com	$2a$10$5.WEnKaYgEMQVSeqEAOLRuR8BHEqLRJ0U9FcT7JPhIZ1/04C7KxYe	2026-01-14 03:15:32.749	1
90	Login User	user1768356932823@test.com	$2a$10$XGckv1XLoY3j7PPeoAJ6hOx1X71C2j1n/3H/13FkCb0T9P17EDlKG	2026-01-14 03:15:32.893	1
91	Cart User	cartuser1768356933316@test.com	$2a$10$ri9Pz971jL0m.n0F3GhqjO.QbWDXdAu9SZXCxgIHXZGmo9F9AaxkG	2026-01-14 03:15:33.399	1
92	New User	newuser1768356968506@test.com	$2a$10$ZD/0pRv66XYF.bLzYvKAl.xxo11ngrA3TDHTs0yb0PE8TTYtkbhjS	2026-01-14 03:16:08.616	1
93	Test	duplicate1768356968629@test.com	$2a$10$4cJSMpbxsdrh8jkSqu74keapEVjUTTdci0j7t3MxgcapyHMK5ow7q	2026-01-14 03:16:08.704	1
94	Login User	user1768356968710@test.com	$2a$10$zWZSCtlcfR8nzr.fS91PL.IuT6AcoG7GyDwbS.M7lsTb2sxMKqUj2	2026-01-14 03:16:08.781	1
95	Login User	user1768356968870@test.com	$2a$10$jBL0SANsLseUzQi/Ub/oU.6SEO2Xr9xJagg55DZG8du71slrP7NYK	2026-01-14 03:16:08.94	1
96	Login User	user1768356969017@test.com	$2a$10$yA9gSd5pXYZ965ycQe3YmOcfb7nbRsdwBFiER1c65GGcI5MTricA2	2026-01-14 03:16:09.087	1
97	Cart User	cartuser1768356969540@test.com	$2a$10$SD98ztw7hYHsDTe.KGEj4eaB1Wayg03cEoCpCWfRQpA92pEJ0bRr6	2026-01-14 03:16:09.627	1
98	Cart User	cartuser1768357429428@test.com	$2a$10$FYmqOz0A2ptRFAVt2Y1pluvkxVMu2TF3kj3b3Cct0vnS4IPwaocBO	2026-01-14 03:23:49.511	1
99	New User	newuser1768357429581@test.com	$2a$10$lKFrFXHWWsxr./M/N2O75.Qm8/.CmWBdgxCMoRjBReadG4zdpaDY2	2026-01-14 03:23:49.664	1
100	Test	duplicate1768357429671@test.com	$2a$10$NvFprSJ.HVXsXD9kc4.CkugzP.Qzy01LDWjDu9VYjucHnwCjUb/T.	2026-01-14 03:23:49.741	1
101	Login User	user1768357429746@test.com	$2a$10$7ANHAqhMDZno7ScC3AGNv.T1/Gw7ZDLDhxrsrDWvfNU.ft1XUNi12	2026-01-14 03:23:49.815	1
102	Login User	user1768357429891@test.com	$2a$10$6I1KwVYRP81v0U9MwR2SoezPvRFoCHYt8eCXYLHJ6hg1LKbgS3a06	2026-01-14 03:23:49.96	1
103	Login User	user1768357430035@test.com	$2a$10$N0hRVyJMhyyAxou.sctHneGWHF.RUhX.M70QyyZw8mgXK5JfbUi/G	2026-01-14 03:23:50.105	1
104	Cart User	cartuser1768876118800@test.com	$2a$10$87XMM0gb9ebQBQXMjSZvtOQmmFVjal6A4AZkqggbv/KssE89dkYU2	2026-01-20 03:28:38.933	1
105	New User	newuser1768876118802@test.com	$2a$10$fdut0yD6ygXCIuQAb5/j..IWW5fWdP4X37EU6AZj5Vm2QbPAk/AEK	2026-01-20 03:28:38.934	1
106	Test	duplicate1768876118948@test.com	$2a$10$iJ2DUiQcBnbjkeMD05.vJuS2zAUbxfn7CZhRZmUZE/y0AWuCH3HS.	2026-01-20 03:28:39.024	1
107	Login User	user1768876119030@test.com	$2a$10$C/7O5F5eyhiQJkRP14hw.OIXjyfRgPPmp59iurmytNH/O3xwWnqDq	2026-01-20 03:28:39.103	1
108	Login User	user1768876119195@test.com	$2a$10$W7SK72MIvdJDsCA1DnHInOckA7IVJ4zW3lweNW0wkcnA7vkWbnYZS	2026-01-20 03:28:39.265	1
109	Login User	user1768876119341@test.com	$2a$10$7EWK5BcUMMePs/1cev/uzOPTcZkaEVLGrhylnnmZN2T2s/i7zovVG	2026-01-20 03:28:39.411	1
110	Cart User	cartuser1768876807202@test.com	$2a$10$3sRP5ca.T2I4OGAuNUV89OeUiehVEtpqKk/nt6cP5j/WcsVocwAaC	2026-01-20 03:40:07.313	1
111	New User	newuser1768876807205@test.com	$2a$10$qDJVfpcBaRV3DkL/PnwWzeyTH5.lx39xX67nZJg00ghfg82kbYN16	2026-01-20 03:40:07.316	1
112	Test	duplicate1768876807326@test.com	$2a$10$cD7VvQU9avlwtnjNJJrvYuZkARk4bw86zMRhkD04bITcyUvBs/wT.	2026-01-20 03:40:07.402	1
113	Login User	user1768876807409@test.com	$2a$10$9sAu5j8xa/8gBT8Tk1WeGe4ZHjTuHLXWYE2Hvhh1zW18bEm.nzVBS	2026-01-20 03:40:07.481	1
114	Login User	user1768876807571@test.com	$2a$10$WgkLEb1V.c.HPZHRFvom0ObCCkEQKneK2i5e2yTL2DnD3zs/5CiWe	2026-01-20 03:40:07.642	1
115	Login User	user1768876807718@test.com	$2a$10$J0315um2qgOXhNm0CFacK.VKvNsfbQ3mI.lyQ77Zc.ULdi0fiPIlm	2026-01-20 03:40:07.788	1
117	Cart User	cartuser1768876916031@test.com	$2a$10$1IbaO7jdPeY.d1RTTvKkgebzxQf9d4XMF3y9m3w0J7.zFtnE62UFq	2026-01-20 03:41:56.145	1
116	New User	newuser1768876916032@test.com	$2a$10$wwoBdgHs1WSqV1dTL0kqmu3Cmcrjo4FBbFYq8dYwF.52k7GtZb1ZW	2026-01-20 03:41:56.144	1
118	Test	duplicate1768876916159@test.com	$2a$10$0fVtScdsM6Ej4Su70zgqAeB95cGroKgzKLcjKJ.7ybNqCzjeGJFbi	2026-01-20 03:41:56.234	1
119	Login User	user1768876916241@test.com	$2a$10$LUpglEnzxGmyMd8LtYSbAewldUK18ECoblqtYkMOunsyEylPi48iS	2026-01-20 03:41:56.313	1
120	Login User	user1768876916423@test.com	$2a$10$Yxa6QUKLq4uAkZ8/F2Stqe/KA.IL34ifT1ZFoPvrRbCvqaf7UhAKK	2026-01-20 03:41:56.502	1
121	Login User	user1768876916577@test.com	$2a$10$pHkOS7JIHSM8xu.tfL5g8ewHS14HuvglA4c0mCJXnN0pNwirFNODa	2026-01-20 03:41:56.647	1
122	New User	newuser1768877073322@test.com	$2a$10$24gMy3AwsU3znUSCbTBoSubncMQn3uECd.VhpZxZlKRy3y1JQ6OhK	2026-01-20 03:44:33.434	1
123	Cart User	cartuser1768877073320@test.com	$2a$10$I/GU7eBHxk7mnvpuziYZwO1D7OLiPXSGKOa.LTyXpEOvjy8I4UzvS	2026-01-20 03:44:33.435	1
124	Test	duplicate1768877073447@test.com	$2a$10$fLN7J3o4m6lO59vb3pQAtuVqimM2pFG/8C23oq1kdClLw4C8h9rwa	2026-01-20 03:44:33.521	1
125	Login User	user1768877073528@test.com	$2a$10$OXE6vMrkcZW57QhoERObzup4Q93SNPCyB5s4r.5mj0myab4ZD08QG	2026-01-20 03:44:33.6	1
126	Login User	user1768877073690@test.com	$2a$10$TfZqMOHBSdVQTm6.faVP0.iGgIQ7UnQhLHu6wQ52Q2.P7Iac/RTSu	2026-01-20 03:44:33.761	1
127	Login User	user1768877073835@test.com	$2a$10$V.xaUROhfFxEGIPOCbTP5.RVOsb7bZIqyzxG5gN2UF/E2Z.7k1xx.	2026-01-20 03:44:33.904	1
128	Cart User	cartuser1768877242727@test.com	$2a$10$a1YJmQqD8juGFIPLFXFxhOSRWXcLf4MPkcRvvhM7/190ZcAfNgXke	2026-01-20 03:47:22.844	1
129	New User	newuser1768877242730@test.com	$2a$10$ZrzNNSYNvyJ3YZc.NiEgDedplevcwb3dIBA9DHXCTkbD.jl4z2nvS	2026-01-20 03:47:22.846	1
130	Test	duplicate1768877242856@test.com	$2a$10$t/XDmEKZHarG8oQGbud2z..dKVcyDZsJ0Uk.CvZQHM5l/f2sf0.fG	2026-01-20 03:47:22.93	1
131	Login User	user1768877242937@test.com	$2a$10$vAIaK8qIdDaUVfFbeMP36.gAZSfrq.WI6MIb50vC6HIZtDlBZ2zJC	2026-01-20 03:47:23.011	1
132	Login User	user1768877243130@test.com	$2a$10$bHi2TGCaKswjOfUxfbQzn.HFM5vF.ou7FdvSSUvd/iNWfOyW84mO.	2026-01-20 03:47:23.2	1
133	Login User	user1768877243276@test.com	$2a$10$toAnRfM/OiSal4jySG8PjekjNHWTd1e2akHlTk3HAM/biT2iDTaS.	2026-01-20 03:47:23.345	1
134	New User	newuser1768877326949@test.com	$2a$10$wuR3QV4vrIGrzztL9nxeNep5pM7gh1oMXGoqZfVsdi.pKat6Dj6.m	2026-01-20 03:48:47.057	1
135	Cart User	cartuser1768877326950@test.com	$2a$10$ALhRAc922Kpg2oeqtV9e7uigsL9xo93tAnb6qa0ixsgCo8TW/ezRO	2026-01-20 03:48:47.065	1
136	Test	duplicate1768877327068@test.com	$2a$10$tW2nscAtwPDBa9YeSlSdG.r3h/CUcVvinn/LOi35AYIJXVz6i2GaW	2026-01-20 03:48:47.146	1
137	Login User	user1768877327152@test.com	$2a$10$5UhnaKgArkZeiZ.RpFD2jO2CaBqVLcIfsgKA5z0n9yHnewCVPN28K	2026-01-20 03:48:47.227	1
138	Login User	user1768877327316@test.com	$2a$10$scy6lejLgim9JhMtWTPZ5.NwYgg88ktGQCQMMKVjNq5zbZeyOv.We	2026-01-20 03:48:47.386	1
139	Login User	user1768877327461@test.com	$2a$10$4odUErsMOgUICsMjCOtWWuJ4CdmtETHMj6ewX9sU3XY2lE9va139q	2026-01-20 03:48:47.531	1
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist (user_id, product_id) FROM stdin;
\.


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_id_seq', 137, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 489, true);


--
-- Name: product_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_views_id_seq', 1438, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 124, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 139, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (cart_id, product_id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: product_views product_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist wishlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (user_id, product_id);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_categories product_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: product_categories product_categories_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_reviews product_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: product_views product_views_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_views product_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_views
    ADD CONSTRAINT product_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: wishlist wishlist_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: wishlist wishlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--


