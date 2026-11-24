// =====================================================================
//  BANCO DE CONTENIDO · Juego del surtido (UD5 Category Management)
//  Fuente: hoja "Banco de productos – Juego del surtido (UD5)"
//  Cada texto visible tiene versión es / en.
// =====================================================================

window.BANCO = (function () {

  // ---------- Ronda 1 · Secciones ----------
  const SECCIONES = [
    { id: "lac", icon: "🥛", es: "Lácteos frescos", en: "Fresh dairy" },
    { id: "pan", icon: "🥖", es: "Panadería y bollería", en: "Bakery" },
    { id: "fyv", icon: "🥬", es: "Frutas y verduras", en: "Fruit & vegetables" },
    { id: "cha", icon: "🧀", es: "Charcutería y quesos", en: "Deli meats & cheese" },
    { id: "beb", icon: "🥤", es: "Bebidas", en: "Beverages" },
    { id: "con", icon: "🧊", es: "Congelados", en: "Frozen food" },
    { id: "des", icon: "🥫", es: "Despensa", en: "Pantry (dry grocery)" },
    { id: "lim", icon: "🧽", es: "Limpieza del hogar", en: "Household cleaning" },
    { id: "hig", icon: "🧴", es: "Higiene y cuidado personal", en: "Personal care" }
  ];

  // [id, icono, ES, EN, sección, dificultad, explicación ES, explicación EN]
  const P = [
    ["P01","🥄","Yogur natural Danone pack 4","Danone plain yogurt, 4-pack","lac","F","Producto lácteo que necesita frío.","A dairy product that needs to be kept chilled."],
    ["P02","🥛","Leche fresca pasteurizada 1 L","Fresh pasteurised milk 1 L","lac","T","A diferencia de la UHT, la leche fresca necesita frío y caduca en pocos días.","Unlike UHT milk, fresh milk needs refrigeration and expires within a few days."],
    ["P03","🧈","Mantequilla con sal 250 g","Salted butter 250 g","lac","M","Derivado lácteo que se conserva refrigerado.","A dairy product that is kept refrigerated."],
    ["P04","🍮","Natillas de vainilla pack 4","Vanilla custard, 4-pack","lac","M","Postre lácteo refrigerado: va junto a yogures y otros postres lácteos.","A chilled dairy dessert: it goes next to yogurts and other dairy desserts."],
    ["P05","🥛","Kéfir natural 500 g","Plain kefir 500 g","lac","F","Leche fermentada refrigerada, como el yogur.","Chilled fermented milk, just like yogurt."],
    ["P06","🥖","Barra de pan","Baguette","pan","F","Pan del día.","Daily fresh bread."],
    ["P07","🍞","Pan de molde integral","Wholemeal sliced bread","pan","F","Aunque venga envasado, es pan.","Even though it is packaged, it is bread."],
    ["P08","🥐","Croissants pack 6","Croissants, 6-pack","pan","F","Bollería.","Pastries."],
    ["P09","🧁","Magdalenas pack 12","Magdalenas (Spanish muffins), 12-pack","pan","F","Bollería.","Pastries."],
    ["P10","🥯","Pan de hamburguesa pack 4","Burger buns, 4-pack","pan","M","Aunque se coma con carne, es pan.","Even if you eat it with meat, it is bread."],
    ["P11","🍌","Plátanos de Canarias","Canary Islands bananas","fyv","F","Fruta fresca.","Fresh fruit."],
    ["P12","🥗","Bolsa de ensalada lista para comer","Ready-to-eat salad bag","fyv","T","Está refrigerada, pero es verdura (cuarta gama) y va en frutas y verduras, no en lácteos.","It is chilled, but it is a vegetable (fresh-cut produce) and belongs in fruit & vegetables, not dairy."],
    ["P13","🍅","Tomates en rama","Vine tomatoes","fyv","F","Verdura fresca.","Fresh vegetables."],
    ["P14","🍏","Manzanas Golden","Golden apples","fyv","F","Fruta fresca.","Fresh fruit."],
    ["P15","🥑","Aguacates","Avocados","fyv","F","Fruta fresca.","Fresh fruit."],
    ["P16","🍖","Jamón serrano loncheado 100 g","Sliced serrano ham 100 g","cha","F","Charcutería envasada.","Packaged deli meat."],
    ["P17","🧀","Queso manchego curado (cuña)","Cured Manchego cheese wedge","cha","M","Aunque es lácteo, el queso curado se coloca con la charcutería, no con los lácteos frescos.","Although it is dairy, cured cheese is placed with deli meats, not with fresh dairy."],
    ["P18","🥩","Chorizo extra","Extra chorizo","cha","F","Embutido.","Cured sausage."],
    ["P19","🦃","Pechuga de pavo en lonchas","Sliced turkey breast","cha","F","Fiambre.","Cold cuts."],
    ["P20","🥓","Salchichón ibérico","Iberian salchichón","cha","F","Embutido.","Cured sausage."],
    ["P21","🥤","Coca-Cola lata 33 cl","Coca-Cola can 33 cl","beb","F","Refresco.","Soft drink."],
    ["P22","💧","Agua mineral 1,5 L","Mineral water 1.5 L","beb","F","Agua envasada.","Bottled water."],
    ["P23","🧃","Zumo de naranja en brik 1 L","Orange juice carton 1 L","beb","M","Zumo de larga duración: no necesita frío hasta abrirse.","Long-life juice: it does not need refrigeration until opened."],
    ["P24","🍺","Cerveza pack 6 latas","Beer, 6-can pack","beb","F","Bebida alcohólica.","Alcoholic beverage."],
    ["P25","🍷","Vino tinto Rioja crianza","Rioja crianza red wine","beb","F","Bebida alcohólica.","Alcoholic beverage."],
    ["P26","🍨","Tarrina de helado de chocolate","Chocolate ice cream tub","con","F","Se conserva congelado.","Kept frozen."],
    ["P27","🍕","Pizza congelada 4 quesos","Frozen four-cheese pizza","con","F","Se conserva congelada.","Kept frozen."],
    ["P28","🫛","Guisantes congelados","Frozen peas","con","M","Es verdura, pero congelada: manda cómo se conserva.","It is a vegetable, but frozen: storage conditions decide."],
    ["P29","🐟","Varitas de merluza","Hake fish fingers","con","F","Pescado congelado.","Frozen fish."],
    ["P30","🍟","Patatas prefritas congeladas","Frozen chips (fries)","con","T","No confundir con las patatas fritas de bolsa, que son un snack de despensa.","Do not confuse them with bagged crisps, which are a pantry snack."],
    ["P31","🍚","Arroz redondo 1 kg","Short-grain rice 1 kg","des","F","Alimentación seca.","Dry grocery."],
    ["P32","🍝","Espaguetis 500 g","Spaghetti 500 g","des","F","Alimentación seca.","Dry grocery."],
    ["P33","🫒","Aceite de oliva virgen extra 1 L","Extra virgin olive oil 1 L","des","F","Alimentación seca.","Dry grocery."],
    ["P34","🥫","Atún en aceite pack 3 latas","Tuna in oil, 3-can pack","des","M","Es pescado, pero en conserva: no necesita frío.","It is fish, but canned: it does not need refrigeration."],
    ["P35","🥔","Patatas fritas de bolsa","Potato crisps bag","des","T","Snack seco; no confundir con las patatas prefritas congeladas.","A dry snack; do not confuse it with frozen chips."],
    ["P36","🥛","Leche UHT semidesnatada 1 L","UHT semi-skimmed milk 1 L","des","T","La UHT no necesita frío hasta abrirse: va en el lineal de alimentación seca, no en el mural refrigerado.","UHT milk does not need refrigeration until opened: it goes on the dry-grocery shelf, not in the chiller."],
    ["P37","🥣","Cereales de desayuno","Breakfast cereal","des","F","Alimentación seca.","Dry grocery."],
    ["P38","🧺","Detergente líquido 30 lavados","Liquid laundry detergent, 30 washes","lim","F","Cuidado de la ropa.","Laundry care."],
    ["P39","🧪","Lejía 2 L","Bleach 2 L","lim","F","Limpieza de superficies.","Surface cleaning."],
    ["P40","🧽","Lavavajillas a mano","Washing-up liquid","lim","F","Limpieza de la vajilla.","Dishwashing."],
    ["P41","🗑️","Bolsas de basura","Bin bags","lim","M","Accesorio de limpieza del hogar.","A household cleaning accessory."],
    ["P42","🫧","Suavizante","Fabric softener","lim","F","Cuidado de la ropa.","Laundry care."],
    ["P43","🧴","Champú anticaspa 400 ml","Anti-dandruff shampoo 400 ml","hig","F","Cuidado del cabello.","Hair care."],
    ["P44","🪥","Pasta de dientes","Toothpaste","hig","F","Higiene bucal.","Oral care."],
    ["P45","🚿","Gel de ducha","Shower gel","hig","F","Higiene corporal.","Body care."],
    ["P46","🌬️","Desodorante roll-on","Roll-on deodorant","hig","F","Higiene corporal.","Body care."],
    ["P47","🪒","Maquinillas de afeitar","Disposable razors","hig","F","Afeitado.","Shaving."],
    ["P48","🧼","Jabón de manos líquido","Liquid hand soap","hig","T","Aunque esté en la cocina o el baño, es para la persona, no para limpiar la casa (¡no es lavavajillas!).","Even if it sits in the kitchen or bathroom, it is for people, not for cleaning the house (it is not washing-up liquid!)."]
  ];
  const PRODUCTOS = P.map(r => ({ id: r[0], icon: r[1], es: r[2], en: r[3], sec: r[4], dif: r[5], expEs: r[6], expEn: r[7] }));

  // ---------- Rondas 2 y 3 · Niveles ----------
  const NIVELES = [
    { n: 1, es: "División", en: "Division" },
    { n: 2, es: "Departamento", en: "Department" },
    { n: 3, es: "Sección", en: "Section", clave: true },
    { n: 4, es: "Categoría", en: "Category", clave: true },
    { n: 5, es: "Subcategoría", en: "Subcategory" },
    { n: 6, es: "Familia", en: "Family" },
    { n: 7, es: "Subfamilia", en: "Subfamily" },
    { n: 8, es: "Referencia", en: "Reference", clave: true }
  ];

  const CADENAS = [
    { id: "C1", icon: "🥤", refEs: "Coca-Cola Zero lata 33 cl pack 6", refEn: "Coca-Cola Zero 33 cl can, 6-pack", t: [
      ["Alimentación","Food"],["Bebidas","Beverages"],["Bebidas sin alcohol","Soft drinks"],["Refrescos","Fizzy drinks"],["Refrescos de cola","Cola drinks"],["Cola sin azúcar","Sugar-free cola"],["Coca-Cola Zero","Coca-Cola Zero"],["Coca-Cola Zero lata 33 cl pack 6","Coca-Cola Zero 33 cl can, 6-pack"]]},
    { id: "C2", icon: "☕", refEs: "Cápsulas descafeinado L'OR caja 10", refEn: "L'OR decaf capsules, box of 10", t: [
      ["Alimentación","Food"],["Alimentación seca","Dry grocery"],["Desayunos","Breakfast"],["Café","Coffee"],["Café en cápsulas","Coffee capsules"],["Cápsulas de café descafeinado","Decaf coffee capsules"],["Cápsulas descafeinado L'OR","L'OR decaf capsules"],["Cápsulas descafeinado L'OR caja 10 uds","L'OR decaf capsules, box of 10"]]},
    { id: "C3", icon: "🍪", refEs: "Digestive con chocolate McVitie's 300 g", refEn: "McVitie's chocolate digestives 300 g", t: [
      ["Alimentación","Food"],["Alimentación seca","Dry grocery"],["Desayunos","Breakfast"],["Galletas","Biscuits"],["Galletas digestive","Digestive biscuits"],["Galletas digestive con chocolate","Chocolate digestive biscuits"],["Digestive con chocolate McVitie's","McVitie's chocolate digestives"],["Digestive con chocolate McVitie's paquete 300 g","McVitie's chocolate digestives, 300 g pack"]]},
    { id: "C4", icon: "🍦", refEs: "Magnum Almendra pack 4", refEn: "Magnum Almond, 4-pack", t: [
      ["Alimentación","Food"],["Congelados","Frozen food"],["Helados y postres congelados","Ice cream & frozen desserts"],["Helados","Ice cream"],["Bombones helados","Ice cream bars"],["Bombón helado de almendra","Almond ice cream bar"],["Magnum Almendra","Magnum Almond"],["Magnum Almendra pack 4","Magnum Almond, 4-pack"]]},
    { id: "C5", icon: "🍖", refEs: "Jamón serrano reserva ElPozo 100 g", refEn: "ElPozo reserva serrano ham 100 g", t: [
      ["Alimentación","Food"],["Refrigerados","Refrigerated"],["Charcutería envasada","Packaged deli meats"],["Jamón curado","Cured ham"],["Jamón curado loncheado","Sliced cured ham"],["Jamón serrano reserva loncheado","Sliced reserva serrano ham"],["Jamón serrano reserva loncheado ElPozo","ElPozo sliced reserva serrano ham"],["Jamón serrano reserva loncheado ElPozo bandeja 100 g","ElPozo sliced reserva serrano ham, 100 g tray"]]},
    { id: "C6", icon: "🧺", refEs: "Ariel líquido ropa de color 30 lavados", refEn: "Ariel Colour liquid, 30 washes", t: [
      ["Droguería y perfumería","Household & personal care"],["Limpieza del hogar","Household cleaning"],["Cuidado de la ropa","Laundry care"],["Detergentes","Laundry detergents"],["Detergente líquido","Liquid detergent"],["Detergente líquido para ropa de color","Liquid detergent for coloured clothes"],["Ariel líquido ropa de color","Ariel Colour liquid"],["Ariel líquido ropa de color botella 30 lavados","Ariel Colour liquid, 30-wash bottle"]]},
    { id: "C7", icon: "🧴", refEs: "H&S anticaspa cabello graso 400 ml", refEn: "Head & Shoulders anti-dandruff oily hair 400 ml", t: [
      ["Droguería y perfumería","Household & personal care"],["Higiene y cuidado personal","Personal care"],["Cuidado del cabello","Hair care"],["Champús","Shampoos"],["Champús anticaspa","Anti-dandruff shampoos"],["Champú anticaspa para cabello graso","Anti-dandruff shampoo for oily hair"],["H&S anticaspa cabello graso","Head & Shoulders anti-dandruff for oily hair"],["H&S anticaspa cabello graso bote 400 ml","Head & Shoulders anti-dandruff for oily hair, 400 ml bottle"]]},
    { id: "C8", icon: "🪥", refEs: "Colgate Max White Carbón 75 ml", refEn: "Colgate Max White Charcoal 75 ml", t: [
      ["Droguería y perfumería","Household & personal care"],["Higiene y cuidado personal","Personal care"],["Higiene bucal","Oral care"],["Pastas dentífricas","Toothpaste"],["Pastas blanqueadoras","Whitening toothpaste"],["Pasta blanqueadora con carbón activo","Whitening toothpaste with activated charcoal"],["Colgate Max White Carbón","Colgate Max White Charcoal"],["Colgate Max White Carbón tubo 75 ml","Colgate Max White Charcoal, 75 ml tube"]]}
  ];

  // ---------- Rondas 4 y 5 · Criterios ----------
  const CRITERIOS = [
    { id: "consumidor", icon: "🧑‍🤝‍🧑", es: "Según el consumidor", en: "According to the consumer",
      detEs: "sexo, edad, condición física, nivel socioeconómico, actitud psicológica",
      detEn: "sex, age, physical condition, socioeconomic level, psychological attitude" },
    { id: "consumo", icon: "⏰", es: "Según el consumo", en: "According to consumption",
      detEs: "momento de consumo, forma de uso, envase, unidad de consumo, tipo de aplicador",
      detEn: "time of consumption, method of use, packaging, unit of consumption, applicator type" },
    { id: "venta", icon: "🏷️", es: "Según las condiciones de venta", en: "According to sales conditions",
      detEs: "precio, formato de venta",
      detEn: "price, sales format" },
    { id: "producto", icon: "📦", es: "Según el producto", en: "According to the product",
      detEs: "beneficio, composición, sabor, tecnología, marca, origen…",
      detEn: "benefit, composition, flavour, technology, brand, origin…" }
  ];

  // Ronda 4 · Lee el lineal
  const LINEALES = [
    { id: "L01", icon: "🥄", catEs: "Yogures", catEn: "Yogurts", crit: "consumidor", varEs: "Edad", varEn: "Age",
      baldas: [["Infantiles (Danonino, Petit Suisse)","Kids (Danonino, Petit Suisse)"],["Adultos (Activia, Danone natural)","Adults (Activia, Danone plain)"],["Mayores (con calcio y vitamina D)","Seniors (with calcium & vitamin D)"]],
      expEs: "Cada balda se dirige a un grupo de edad distinto.", expEn: "Each shelf targets a different age group." },
    { id: "L02", icon: "☀️", catEs: "Protección solar", catEn: "Sun care", crit: "consumo", varEs: "Tipo de aplicador", varEn: "Applicator type",
      baldas: [["Spray","Spray"],["Crema","Cream"],["Stick","Stick"]],
      expEs: "El producto es el mismo; cambia cómo se aplica.", expEn: "The product is the same; what changes is how it is applied." },
    { id: "L03", icon: "🥜", catEs: "Frutos secos", catEn: "Nuts", crit: "venta", varEs: "Formato de venta", varEn: "Sales format",
      baldas: [["A granel (se pesan al gusto)","Loose (weighed to order)"],["Envasados (bolsas cerradas)","Pre-packed (sealed bags)"]],
      expEs: "Lo que cambia es cómo se vende: a peso o ya envasado.", expEn: "What changes is how it is sold: by weight or pre-packed." },
    { id: "L04", icon: "🍓", catEs: "Mermeladas", catEn: "Jams", crit: "producto", varEs: "Sabor", varEn: "Flavour",
      baldas: [["Fresa","Strawberry"],["Melocotón","Peach"],["Naranja amarga","Bitter orange"]],
      expEs: "Las baldas se separan por el sabor del propio producto.", expEn: "The shelves are split by the flavour of the product itself." },
    { id: "L05", icon: "🥔", catEs: "Patatas fritas de bolsa", catEn: "Potato crisps", crit: "consumo", varEs: "Unidad de consumo", varEn: "Unit of consumption",
      baldas: [["Bolsa individual 40 g","Single-serve bag 40 g"],["Bolsa familiar 300 g","Family bag 300 g"]],
      expEs: "Cambia cuánta gente o cuántas raciones se consumen de una vez.", expEn: "What changes is how many people or servings are consumed at once." },
    { id: "L06", icon: "☕", catEs: "Café molido", catEn: "Ground coffee", crit: "venta", varEs: "Precio", varEn: "Price",
      baldas: [["Marca del súper (2,49 €)","Store brand (€2.49)"],["Marca de fabricante (4,29 €)","Manufacturer brand (€4.29)"],["Gama premium (8,95 €)","Premium range (€8.95)"]],
      expEs: "Las baldas son tramos de precio.", expEn: "The shelves are price tiers." },
    { id: "L07", icon: "🫒", catEs: "Aceite de oliva virgen extra", catEn: "Extra virgin olive oil", crit: "producto", varEs: "Origen", varEn: "Origin",
      baldas: [["DOP Sierra Mágina (Jaén)","PDO Sierra Mágina (Jaén)"],["DOP Priego de Córdoba","PDO Priego de Córdoba"],["DOP Siurana (Tarragona)","PDO Siurana (Tarragona)"]],
      expEs: "Todos son virgen extra; se separan por su denominación de origen.", expEn: "They are all extra virgin; they are split by their designation of origin." },
    { id: "L08", icon: "🏋️", catEs: "Batidos y suplementos", catEn: "Shakes & supplements", crit: "consumidor", varEs: "Condición física", varEn: "Physical condition",
      baldas: [["Para deportistas (proteína)","For athletes (protein)"],["Para control de peso","For weight control"]],
      expEs: "Se dirigen a personas con necesidades físicas distintas.", expEn: "They target people with different physical needs." },
    { id: "L09", icon: "🍿", catEs: "Snacks", catEn: "Snacks", crit: "consumo", varEs: "Momento de consumo", varEn: "Time of consumption",
      baldas: [["Para el aperitivo (aceitunas, frutos secos salados)","For pre-dinner drinks (olives, salted nuts)"],["Para la merienda (barritas, galletas)","For the afternoon snack (bars, biscuits)"]],
      expEs: "Se separan por el momento del día en que se consumen.", expEn: "They are split by the time of day when they are eaten." },
    { id: "L10", icon: "🧴", catEs: "Champús", catEn: "Shampoos", crit: "consumidor", varEs: "Sexo", varEn: "Sex",
      baldas: [["Mujer","Women"],["Hombre","Men"]],
      expEs: "Cada balda se dirige a un público según su sexo.", expEn: "Each shelf targets an audience according to sex." },
    { id: "L11", icon: "🥛", catEs: "Leche", catEn: "Milk", crit: "producto", varEs: "Composición", varEn: "Composition",
      baldas: [["Entera","Whole"],["Semidesnatada","Semi-skimmed"],["Desnatada","Skimmed"]],
      expEs: "Se separan por el contenido de grasa, una característica del propio producto.", expEn: "They are split by fat content, a feature of the product itself." },
    { id: "L12", icon: "🪥", catEs: "Cepillos de dientes", catEn: "Toothbrushes", crit: "producto", varEs: "Tecnología", varEn: "Technology",
      baldas: [["Manuales","Manual"],["Eléctricos","Electric"]],
      expEs: "La diferencia está en la tecnología del producto.", expEn: "The difference lies in the product's technology." },
    { id: "L13", icon: "🍷", catEs: "Vinos", catEn: "Wines", crit: "venta", varEs: "Formato de venta", varEn: "Sales format",
      baldas: [["Botella suelta","Single bottle"],["Caja de 6 botellas","Case of 6 bottles"]],
      expEs: "Ojo: no es unidad de consumo. Con la caja sigues abriendo una botella cada vez; lo que cambia es cómo se vende. (Compáralo con las patatas: la bolsa familiar sí cambia cuánto se consume de una vez).",
      expEn: "Careful: this is not unit of consumption. With the case you still open one bottle at a time; what changes is how it is sold. (Compare with crisps: the family bag does change how much is eaten at once)." }
  ];

  // Ronda 5 · Encargos del jefe
  const ENCARGOS = [
    { id: "E1", icon: "🍪", catEs: "Galletas", catEn: "Biscuits", crit: "venta", varEs: "precio", varEn: "price",
      baldas: [["bajo","Precio bajo","Low price"],["medio","Precio medio","Mid price"],["alto","Precio alto","High price"]],
      productos: [
        ["E1a","🍪","Galletas María La Despensa 0,95 €","La Despensa Maria biscuits €0.95","bajo","Marca del súper, el precio más bajo de la categoría.","Store brand, the lowest price in the category."],
        ["E1b","🍪","Digestive La Despensa 1,10 €","La Despensa digestives €1.10","bajo","Marca del súper, tramo bajo.","Store brand, low tier."],
        ["E1c","🍪","Galletas María Fontaneda 1,89 €","Fontaneda Maria biscuits €1.89","medio","Marca de fabricante, tramo medio.","Manufacturer brand, mid tier."],
        ["E1d","🍪","Digestive McVitie's 2,29 €","McVitie's digestives €2.29","medio","Marca de fabricante, tramo medio.","Manufacturer brand, mid tier."],
        ["E1e","🎁","Galletas danesas de mantequilla en lata 6,50 €","Danish butter cookies tin €6.50","alto","Producto de regalo o gourmet, tramo alto.","Gift or gourmet product, high tier."],
        ["E1f","🥮","Galletas artesanas de almendra 5,90 €","Artisan almond biscuits €5.90","alto","Artesanas, tramo alto.","Artisan, high tier."]]},
    { id: "E2", icon: "🧴", catEs: "Champús", catEn: "Shampoos", crit: "consumidor", varEs: "sexo y edad", varEn: "sex and age",
      baldas: [["mujer","Mujer","Women"],["hombre","Hombre","Men"],["infantil","Infantil","Kids"]],
      productos: [
        ["E2a","👶","Johnson's Baby champú","Johnson's Baby shampoo","infantil","Dirigido a bebés y niños.","Aimed at babies and children."],
        ["E2b","🧒","Champú infantil sin lágrimas La Despensa","La Despensa tear-free kids' shampoo","infantil","Dirigido a niños, aunque sea marca blanca: aquí el precio no manda.","Aimed at children, even though it is a store brand: price is not the criterion here."],
        ["E2c","🧔","Nivea Men champú","Nivea Men shampoo","hombre","Línea masculina.","Men's line."],
        ["E2d","🧔","H&S Men Ultra champú","Head & Shoulders Men Ultra shampoo","hombre","Línea masculina, aunque sea anticaspa: aquí el beneficio no manda.","Men's line, even though it is anti-dandruff: benefit is not the criterion here."],
        ["E2e","👩","L'Oréal Elvive (gama mujer)","L'Oréal Elvive (women's range)","mujer","Línea femenina.","Women's line."],
        ["E2f","👩","Dove reparación (gama mujer)","Dove repair (women's range)","mujer","Línea femenina.","Women's line."]]},
    { id: "E3", icon: "🌬️", catEs: "Desodorantes", catEn: "Deodorants", crit: "consumo", varEs: "tipo de aplicador", varEn: "applicator type",
      baldas: [["spray","Spray","Spray"],["roll","Roll-on","Roll-on"],["stick","Stick","Stick"]],
      productos: [
        ["E3a","💨","Rexona spray 200 ml","Rexona spray 200 ml","spray","Se aplica pulverizando.","Applied by spraying."],
        ["E3b","💨","Axe spray 150 ml","Axe spray 150 ml","spray","Se aplica pulverizando, aunque sea de hombre: aquí el sexo no manda.","Applied by spraying, even though it is for men: sex is not the criterion here."],
        ["E3c","🔵","Dove roll-on 50 ml","Dove roll-on 50 ml","roll","Se aplica con bola.","Applied with a roller ball."],
        ["E3d","🔵","Sanex roll-on 50 ml","Sanex roll-on 50 ml","roll","Se aplica con bola.","Applied with a roller ball."],
        ["E3e","🧱","Nivea stick 50 ml","Nivea stick 50 ml","stick","Barra sólida.","Solid stick."],
        ["E3f","🧱","Desodorante en barra La Despensa","La Despensa solid deodorant stick","stick","Barra sólida.","Solid stick."]]},
    { id: "E4", icon: "🍕", catEs: "Platos preparados", catEn: "Ready meals", crit: "consumo", varEs: "unidad de consumo", varEn: "unit of consumption",
      baldas: [["ind","Individual","Single-serve"],["fam","Familiar","Family size"]],
      productos: [
        ["E4a","🍕","Pizza individual 4 quesos","Single-serve four-cheese pizza","ind","Una ración.","One serving."],
        ["E4b","🍝","Lasaña boloñesa 300 g","Beef lasagne 300 g","ind","Una ración.","One serving."],
        ["E4c","🍝","Macarrones con tomate 350 g (1 ración)","Macaroni in tomato sauce 350 g (1 serving)","ind","Una ración.","One serving."],
        ["E4d","🍕","Pizza familiar barbacoa 900 g","Family-size BBQ pizza 900 g","fam","Para compartir.","For sharing."],
        ["E4e","🍝","Lasaña boloñesa 1 kg (4 raciones)","Beef lasagne 1 kg (4 servings)","fam","Varias raciones.","Several servings."],
        ["E4f","🥘","Paella de marisco 4 raciones","Seafood paella, 4 servings","fam","Varias raciones.","Several servings."]]},
    { id: "E5", icon: "🫒", catEs: "Aceites", catEn: "Cooking oils", crit: "producto", varEs: "composición", varEn: "composition",
      baldas: [["aove","Oliva virgen extra","Extra virgin olive oil"],["oliva","Oliva (suave o intenso)","Olive oil (mild or intense)"],["gira","Girasol","Sunflower oil"]],
      productos: [
        ["E5a","🫒","Carbonell virgen extra 1 L","Carbonell extra virgin 1 L","aove","Aceite de oliva virgen extra.","Extra virgin olive oil."],
        ["E5b","🫒","AOVE DOP Jaén Picual 500 ml","EVOO PDO Jaén Picual 500 ml","aove","Trampa: la DOP es el origen, pero el encargo pide composición. Sigue siendo virgen extra.","Trap: the PDO is the origin, but the order asks for composition. It is still extra virgin."],
        ["E5c","🫗","Aceite de oliva suave 0,4º La Despensa","La Despensa mild olive oil 0.4º","oliva","Aceite de oliva refinado, no virgen extra.","Refined olive oil, not extra virgin."],
        ["E5d","🫗","Aceite de oliva intenso 1º Koipe","Koipe intense olive oil 1º","oliva","Aceite de oliva, no virgen extra.","Olive oil, not extra virgin."],
        ["E5e","🌻","Koipesol girasol 1 L","Koipesol sunflower oil 1 L","gira","Aceite de semillas de girasol.","Sunflower seed oil."],
        ["E5f","🌻","Aceite de girasol alto oleico La Despensa","La Despensa high-oleic sunflower oil","gira","Trampa: «alto oleico» suena a oliva, pero es aceite de girasol.","Trap: 'high-oleic' sounds like olive, but it is sunflower oil."]]},
    { id: "E6", icon: "🥛", catEs: "Leches", catEn: "Milks", crit: "consumidor", varEs: "edad y condición física", varEn: "age and physical condition",
      baldas: [["crec","Crecimiento (niños)","Growing-up (kids)"],["sinlac","Sin lactosa","Lactose-free"],["may","Mayores","Seniors"]],
      productos: [
        ["E6a","🧒","Puleva Peques 3","Puleva Peques 3 growing-up milk","crec","Dirigida a niños pequeños.","Aimed at young children."],
        ["E6b","🧒","Nestlé Junior Crecimiento 1+","Nestlé Junior growing-up milk 1+","crec","Dirigida a niños a partir de 1 año.","Aimed at children aged 1 and over."],
        ["E6c","🥛","Central Lechera Asturiana sin lactosa","Central Lechera Asturiana lactose-free","sinlac","Dirigida a personas que no toleran la lactosa (condición física).","Aimed at people who cannot tolerate lactose (physical condition)."],
        ["E6d","🥛","Kaiku sin lactosa","Kaiku lactose-free","sinlac","Condición física del consumidor.","The consumer's physical condition."],
        ["E6e","🦴","Puleva Calcio","Puleva Calcium","may","Refuerzo de calcio pensado para adultos y mayores.","Extra calcium aimed at adults and seniors."],
        ["E6f","👵","Leche +50 con calcio y vitamina D La Despensa","La Despensa 50+ milk with calcium & vitamin D","may","Dirigida a mayores de 50.","Aimed at people over 50."]]}
  ];

  return { SECCIONES, PRODUCTOS, NIVELES, CADENAS, CRITERIOS, LINEALES, ENCARGOS };
})();
