Obligations
 Norme Javascript: ES6/ES2015
 Notions présentes:
 - Prototypes d'objet natif (String, Object, Number, ...)
 - Object.prop_access avec exception
 - String.interpolate(animal)
 - remplace toutes les chaines entourées de "{{ }}" par la valeur de l'objet
 - machaine = "Type d'animal: {{ type.name }}"
 - animal = {type: {name: "chien"}}
 - machaine.interpolate(animal) => "Type d'animal: chien"
 - Création d'objet et objet hérité dont certains avec attributs/méthodes privés
 - Création de modules
 - Gestion de l'historique (système de routage)
 - Utilisation des Promises
 - Utilisation du type_checker
 - version minimum: 3
 - exemples cas d'utilisation: Vérifier les données en entrée de constructeur
Contenu index.html:
 <html>
 <head>
 ...
 <script type="module" src="./main.js"/>
 </head>
 <body>
 <div id="root"></div>
</body>
 </html>
Interdictions
 - Utilisation de task-runners sauf compilateur SASS
 - Utilisation de Framework/Librairies (React, Angular, VueJS, jQuery, ...) sauf CSS (TailwindCSS,
Bootstrap CSS, ...)
Evaluation
 - Code Source (CC2) + Soutenance
 - Durée de la soutenance: 20min
- Démo: 15min
- Questions: 5min (+1 question de cours/personne 2pts)
 - Audience: Huis-clos
 - Bonus: 2 points max
- Participation à la communauté OpenSource (1pt)
- Utilisation de l'API FileReader (0.5pt)
- ServiceWorker:
- gestion online/offline (0.5pt)
- WebPush (0.5pt)
- ... (0.5pt)
- Sensors API
- Proximity (0.5pt)
- Orientation (0.5pt)
- ... (0.5pt)