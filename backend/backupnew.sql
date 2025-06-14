PGDMP     (    +    	            }            reactecommerce    15.2    15.2 V    v           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            w           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            x           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            y           1262    20586    reactecommerce    DATABASE     �   CREATE DATABASE reactecommerce WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Chile.1252';
    DROP DATABASE reactecommerce;
                postgres    false            �            1259    28974 
   cart_items    TABLE     �   CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity >= 0))
);
    DROP TABLE public.cart_items;
       public         heap    postgres    false            �            1259    28973    cart_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.cart_items_id_seq;
       public          postgres    false    232            z           0    0    cart_items_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;
          public          postgres    false    231            �            1259    28793    carts    TABLE     �   CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer,
    status character varying(20) DEFAULT 'open'::character varying,
    created_date timestamp without time zone DEFAULT now()
);
    DROP TABLE public.carts;
       public         heap    postgres    false            �            1259    28792    carts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.carts_id_seq;
       public          postgres    false    221            {           0    0    carts_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;
          public          postgres    false    220            �            1259    28872 
   categories    TABLE     f   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    28871    categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public          postgres    false    224            |           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public          postgres    false    223            �            1259    28955    order_items    TABLE     �   CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price_at_purchase numeric NOT NULL
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    28940    orders    TABLE     �   CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'pending'::text
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    28939    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    229            }           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    228            �            1259    28878    product_categories    TABLE     n   CREATE TABLE public.product_categories (
    product_id integer NOT NULL,
    category_id integer NOT NULL
);
 &   DROP TABLE public.product_categories;
       public         heap    postgres    false            �            1259    20588    products    TABLE     �   CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_date timestamp without time zone DEFAULT now(),
    price numeric(10,2),
    stock integer
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    20587    products_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.products_id_seq;
       public          postgres    false    215            ~           0    0    products_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
          public          postgres    false    214            �            1259    28893    profiles    TABLE     f   CREATE TABLE public.profiles (
    user_id integer NOT NULL,
    address text,
    avatar_url text
);
    DROP TABLE public.profiles;
       public         heap    postgres    false            �            1259    28779    roles    TABLE     `   CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    28778    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public          postgres    false    219                       0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public          postgres    false    218            �            1259    20599    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name text NOT NULL,
    role_id integer
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    20598    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    217            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    216            �            1259    28856    wishlist    TABLE     `   CREATE TABLE public.wishlist (
    user_id integer NOT NULL,
    product_id integer NOT NULL
);
    DROP TABLE public.wishlist;
       public         heap    postgres    false            �            1259    28924    wishlist_items    TABLE     f   CREATE TABLE public.wishlist_items (
    user_id integer NOT NULL,
    product_id integer NOT NULL
);
 "   DROP TABLE public.wishlist_items;
       public         heap    postgres    false            �           2604    28977    cart_items id    DEFAULT     n   ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);
 <   ALTER TABLE public.cart_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            �           2604    28796    carts id    DEFAULT     d   ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);
 7   ALTER TABLE public.carts ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    28875    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    28943 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228    229            �           2604    20591    products id    DEFAULT     j   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    28782    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    20602    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            s          0    28974 
   cart_items 
   TABLE DATA           G   COPY public.cart_items (id, cart_id, product_id, quantity) FROM stdin;
    public          postgres    false    232   �b       h          0    28793    carts 
   TABLE DATA           B   COPY public.carts (id, user_id, status, created_date) FROM stdin;
    public          postgres    false    221   c       k          0    28872 
   categories 
   TABLE DATA           .   COPY public.categories (id, name) FROM stdin;
    public          postgres    false    224   [c       q          0    28955    order_items 
   TABLE DATA           X   COPY public.order_items (order_id, product_id, quantity, price_at_purchase) FROM stdin;
    public          postgres    false    230   �c       p          0    28940    orders 
   TABLE DATA           A   COPY public.orders (id, user_id, created_at, status) FROM stdin;
    public          postgres    false    229   �c       l          0    28878    product_categories 
   TABLE DATA           E   COPY public.product_categories (product_id, category_id) FROM stdin;
    public          postgres    false    225   d       b          0    20588    products 
   TABLE DATA           U   COPY public.products (id, name, description, created_date, price, stock) FROM stdin;
    public          postgres    false    215   4d       m          0    28893    profiles 
   TABLE DATA           @   COPY public.profiles (user_id, address, avatar_url) FROM stdin;
    public          postgres    false    226   9v       f          0    28779    roles 
   TABLE DATA           )   COPY public.roles (id, name) FROM stdin;
    public          postgres    false    219   Vv       d          0    20599    users 
   TABLE DATA           O   COPY public.users (id, email, password, created_at, name, role_id) FROM stdin;
    public          postgres    false    217   �v       i          0    28856    wishlist 
   TABLE DATA           7   COPY public.wishlist (user_id, product_id) FROM stdin;
    public          postgres    false    222   �w       n          0    28924    wishlist_items 
   TABLE DATA           =   COPY public.wishlist_items (user_id, product_id) FROM stdin;
    public          postgres    false    227   x       �           0    0    cart_items_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.cart_items_id_seq', 36, true);
          public          postgres    false    231            �           0    0    carts_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.carts_id_seq', 56, true);
          public          postgres    false    220            �           0    0    categories_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categories_id_seq', 4, true);
          public          postgres    false    223            �           0    0    orders_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.orders_id_seq', 1, true);
          public          postgres    false    228            �           0    0    products_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.products_id_seq', 109, true);
          public          postgres    false    214            �           0    0    roles_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.roles_id_seq', 5, true);
          public          postgres    false    218            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          postgres    false    216            �           2606    28982 ,   cart_items cart_items_cart_id_product_id_key 
   CONSTRAINT     v   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_product_id_key UNIQUE (cart_id, product_id);
 V   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_cart_id_product_id_key;
       public            postgres    false    232    232            �           2606    28980    cart_items cart_items_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_pkey;
       public            postgres    false    232            �           2606    28799    carts carts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.carts DROP CONSTRAINT carts_pkey;
       public            postgres    false    221            �           2606    28877    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    224            �           2606    28961    order_items order_items_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    230    230            �           2606    28949    orders orders_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    229            �           2606    28882 *   product_categories product_categories_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (product_id, category_id);
 T   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_pkey;
       public            postgres    false    225    225            �           2606    20596    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    215            �           2606    28899    profiles profiles_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);
 @   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pkey;
       public            postgres    false    226            �           2606    28786    roles roles_name_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
 >   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_name_key;
       public            postgres    false    219            �           2606    28784    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    219            �           2606    28994    carts unique_user_id 
   CONSTRAINT     R   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT unique_user_id UNIQUE (user_id);
 >   ALTER TABLE ONLY public.carts DROP CONSTRAINT unique_user_id;
       public            postgres    false    221            �           2606    20609    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    217            �           2606    20607    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    217            �           2606    28928 "   wishlist_items wishlist_items_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (user_id, product_id);
 L   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT wishlist_items_pkey;
       public            postgres    false    227    227            �           2606    28860    wishlist wishlist_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_pkey PRIMARY KEY (user_id, product_id);
 @   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_pkey;
       public            postgres    false    222    222            �           2606    28983 "   cart_items cart_items_cart_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_cart_id_fkey;
       public          postgres    false    221    232    3248            �           2606    28988 %   cart_items cart_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 O   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT cart_items_product_id_fkey;
       public          postgres    false    215    3238    232            �           2606    28995    carts fk_carts_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 =   ALTER TABLE ONLY public.carts DROP CONSTRAINT fk_carts_user;
       public          postgres    false    3242    221    217            �           2606    28787    users fk_role    FK CONSTRAINT     l   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles(id);
 7   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_role;
       public          postgres    false    3246    219    217            �           2606    28962 %   order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);
 O   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    3262    230    229            �           2606    28967 '   order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 Q   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    215    3238    230            �           2606    28950    orders orders_user_id_fkey    FK CONSTRAINT     y   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 D   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_user_id_fkey;
       public          postgres    false    217    3242    229            �           2606    28888 6   product_categories product_categories_category_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);
 `   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_category_id_fkey;
       public          postgres    false    224    3254    225            �           2606    28883 5   product_categories product_categories_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 _   ALTER TABLE ONLY public.product_categories DROP CONSTRAINT product_categories_product_id_fkey;
       public          postgres    false    225    215    3238            �           2606    28900    profiles profiles_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 H   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_user_id_fkey;
       public          postgres    false    217    3242    226            �           2606    28934 -   wishlist_items wishlist_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 W   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT wishlist_items_product_id_fkey;
       public          postgres    false    227    3238    215            �           2606    28929 *   wishlist_items wishlist_items_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 T   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT wishlist_items_user_id_fkey;
       public          postgres    false    227    3242    217            �           2606    28866 !   wishlist wishlist_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);
 K   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_product_id_fkey;
       public          postgres    false    215    3238    222            �           2606    28861    wishlist wishlist_user_id_fkey    FK CONSTRAINT     }   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT wishlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 H   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT wishlist_user_id_fkey;
       public          postgres    false    222    217    3242            s   0   x���  �w;�w������P�r*C�NS�~ͷÜo���a      h   F   x�Mʫ�0P�L����khf�b����o�������1�kX4�����cQ�ӚfC��H`�.>��?���      k   )   x�3���OO,�2�t�IM.)�O��M-.�L�/����� ��
/      q      x�3�42�4�41262����� ��      p   4   x�3�4�4202�50�52T0��2��2��3�01�0�,H�K��K����� ��	@      l   "   x�3�4�2�4�240��`�(
"M�b���� `�      b      x��[�v۶�}&��o�%� A� ��K�t'm:������BQ��m�Ty�#�����cg.�*Y7����P�º�9�8?��2��y�}3ٝ�&�2�iY,���+�^k�$O6ɍɫ�)����ԯ�y��=�-uU��)�ʫ�]��S���H��K�dYW�$��f�0�E7~tp/������̏XEg�L)G.s>&�b�,�p��թ��H�O����'Y3Z��x�Y51�?ͽ��y�Uc�(9�}'�n��>��[]&2im���Ҕ^Z<�,K�E����y��Yo��7ˬ�%i�Ye�ዷ+𙭮�S�J;��Y9*t��{>/��_�CV�������}�ҤkOW��S�ܣ%(������*�gi釵�T�:��L��;/Y�G5�{���	}6��	�9?��"/Ȍ��3�L�ª��ٖ�<A$�\?�Z�'������l��Xzo�"$�W"�x�1q�L*G�1�Q<����(���Z�J;߱�ǢLRS A��3��(Kjd)�&�*�hU�v��z[[;�6�jD�,6ޗ
iug^y�D��>50�a�	�(�o�S�
�kc��C�!fIi�z�S�L2�h��Z�Tt��I(j��|4lZ��J��Z�t��m�d�Zg����z� )�D�:,v��-����Vk�Q1��cۅm���OQ����E����4y��f�E�XS�"t�b�E������uo{�6�Ν�~l���

┯�7/M���殹ӯ��u�VM�<����es&G�/G��f�p��)�+�)��u�lL�llL��C��$��Z+8A6=$��D���3����Nwi�U�zht.�x�Fm�E(ezbq����X̘r�tw�T~�so���(۴Ȼ�i�u�������]�L����� Ղ ���a,�~��7���L��F�����V�kL��Ƕ��*��,R�7���}������7���0&ȡ�Xt�d�E�iX��Ғ���H_��27�nu��=M�;`�y��%
���2K�����;@1�
J<��6;�%M���G�2��M=R��b�mj �{^<��� ��a��Cn �_ �� �T��oe�D�"O��UI�n�k�������&��%�,5�9���<<ʄX�N�^�w�9�fOt�N-�W60�@Q��(��Ǯ��Fc�(�z�Af�-񑝀rM���a�ޝ�KI�g*r|��FW��N{_��^bs�?�=�TI��X�1�9$�	����{PI[�o�ͼ(����ߧ&��Q?��o���y�E���������90�Lɲ�q1�d�˂I9��I��vz�%�����p�E.Q!C�J2'.c#��x�	�c�؄�ڱʊ*^bK�T#�>�]6��>SHE_�%s�J/2!x�Q8cH��T��NL�
��T��ȷdAj����(�,�f͏h^-�,����&C=a#�ŧ��>T	P4�]����Byv�~�����Z�LK9)��o�1�@
*���ߊeݫ߶� Cপ��j5uS61�d=Kb�tI".��:�y��E�����բ��y^�#����&]iږ/Cnx�N�y��gZ��jh��.�S�C�͔� Qe��IJ�Z���v���I��4=�����Y�E�����u�s*v�,��'b�p�>������^o�2��K}�Q�&+C9׫�W��l(O!jĕtbɨ�R��A�RMJ�6xT��A��	�'#�C	�,���g$Q��"���v��wu�;]��6�
��-uO9yY��H��62r�p��~�'D_�d���{Ҫh�q��+�`�;!�0(���`L���r �L�*�&A?�C�dq6	��@l�6š�|lKb��g�3a�����Z쯿�nnr��Q�9��6�n��Pc�9�ʽ	Z}� ��c�j6[�=\�0����v�2�歘��/�N�B������K���Gu:�%�c,"h/��L�B�㐬�q۬����%�]Q�)2so/i�	A;j�mt�6��f�P�/@�9CeB���|�'�S�x?@���<�����NG�~5tL=�5�6)�wM�Z�^>@�+�۹�{��4)M�&���Fmb�'���~Ԡ�����
�B!�¦��wy�|�9%ȨR��8F3�xޟ�/S�2���n;DV��Pۖ��2�!��~5i�hg^P"Mv��QA�C�	�"N�NE:�^g�`I��,2'��T��П��!��#����;�ݐj�&���a�Ȁܖ�.���y(��ⱋ���@���;�H]4����{�Q/h�g��h:��������ThC�h��P�FjC�*)�4,�^<\��H���N������O��H��X����!mh�=�����t�X)�/������j��%��!��d.0)䋮I���:CL�rTKK9�$����ҩ��1Mf��JDM��.?���bu��-�3�g�3�,ߏ!�
w#���t�K�'��YL��J�	�$]��
EB��Z�T�e���IѢ'U�P��׃�my�r�
;)�b���ҍX':�t�3�L!�����tE�T��t����ҷS[�<D�'0�7����cM~?�$a�B�J���t�R$FB8�?�zXiv(�W��O%4��@��5���9#x��0FvF�g�!J��v(u��]��fLP[KS�f�"/J�P���QH ��ɠl б�e��s�!8l0����_р��>���C�FQL��7ӃŢ��n�J}��� ��76�/NfZo/Me��z�G8rXz��]���UQ��Vlֺc���	[��/J6�cp]�D|\���'�Mb�o�-x؏���W9�\����i6���;��\��Y��� ��ɭֲ+��r�ķ;�;���\}&""�g��W��xrR�	+��6��<JS���>ш�b;.wȟ�D/�D���3��Ѝ��,Zk��M�N6I5-n{^4�¬�Ջ�r�8�$b�<QH�(+����\��|E�$�Y�3�q�`M�S2���$�?eڴ��t���O����F���v�,�����i���'����+�,���^jP����R������&����_�9|{�:��2k�˧G�]�PHh� ����Z�9\�4��XL�dl)�/]� ���B���0���A_J��3���1�5����1%(g��ّx?�KҴ)	V�1��-BH;��5��r�f�pL��Գv���
�&���d�C�
���px����+�J�]f!?���ҽ��e!�P��}�+;α�C�h�K[(��H�<k�ݚ@r ����5:JFt�Ŏ+"�Þ���e������$Qzwp��#X.���:e�wXRgL��q�8'�L4B�8;�im=�P��Q���C6{��]�d�==w�o��6TG��N�iǾŧ�F�.T�#t�-���T��-�א��DȆ����-��/F��y�>~{ʚ8����D��'|=j_{�b�2[�}�����$��/��#�
}���"�֦yh/7Ϭ�f$��.,�@2��4�BN�8éQ�>���n�	�FA�N�2�N��n�p`��y�Ƞ�*��pl�N��[�����#�KӝH��F���2��p�pb�i�NG[��FES`�32Z�XX��(_���Nxдd�7��@ƞA����1� Z ,W͂e s�H��n���+V�����r'B�ލ��j��t���`\�E8?��W�c��U�lQ�8L'�|��O'y����2P�t��T!�ccӍ�Hq���+̡Q�����7�_�s�ϥ^5��E�*�i��h�rR�=�o�H��v|3q��gGO�U)M/��E!�l���? m�Ǯh��1)�=}N@����9I��Z������_�C��:�tl��2ۍk�ԯ@Iʛ���e�A�Q��	�u�x~�#ӓ�?��|YʧY��w����kN#��}���%
�������5����1���g�?��
4�w���Go]��.�Â�(��FF�P;_����0��nGgWܢ�"za^#C!� �"�tUp��6G�I�t����(���Ѣʥ	V^���M�$�� ���R�� �  ��ځY{\��kwoe[���t�;r��5h|�?�����^l����^�mz�9uu�}݋s����m���@(K��U|2��Y�:��C����Ӌ·��Ԕ��ї�G$��؏fAL�9UtxS��������`Ns9{�� _������tP���R0�jI���z�5�A�;/G"�漽�+W�f��#�_��	k�.�����3�銍��d��;��u��)�F��ݕ=�ڠ̨�_f��ikc��{����#;q;W�4e��!e��lb����͢D�s
-�A4�=�E��ijtmu���l��!gl��2�QiddDw� j�p1Ў��� �@W�3{>} B����0(����+l�9T��/睮��lS���������0���! DXY�M>^���������+	�>l����?Ͼ@�R1�a���+_�[��Tp�oA4���_^�q��6�"�tEt�9�#I�ӯ�o����Y(����W���u��33A�      m      x������ � �      f   $   x�3�tL����2�-N-�2�t/M-.����� lX      d   W  x�e��r�@ ����S�pk�!�ӕji�D&"ĸY	�����Ŵ�>�7�O@R�C+��.E
��1�+$[3�s�������j�[:��צM�����
w���d@�,"1�A�5��@��e�Q��kTV�SsG� ����6�d�-�����`h�_�`���1;w7�u`R�]�̓c�_H���)�� &��`?��A-�k��!2���,kxj��x|����Q6��	mϽ���p�o��;�j6[[P)���X�d0� *D:����]X�Aʳ�]��5�"��NO�8v���'�j��+-��c��#�i�����٥�ş���201ؽ�"B@�9�$�,���      i      x������ � �      n      x������ � �     