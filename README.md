# Concerts Web App
Concerts is a web application, made in HTML, CSS, and JS, that simplifies the search, filtering, and bookmarking of your favorite concert events in Poland using the Ticketmaster API </br>
Demo: [abrylanska.github.io/concertapp/](abrylanska.github.io/concertapp/)

# Table of Contents
* [Overview](#overview)
   * [Home Page](#home)
   * [Search Page](#search)
   * [About Page](#about)
   * [Contact Page](#contact)
   * [Favorites Page](#favorites)


## Overview
Concerts is an application that retrieves data from the Ticketmaster API. Dynamically displays a list of concerts in Poland, along with information such as date, time of the event or city.

A given event can also be added to favorites, which results in storing it in local storage and then displaying it on the favorites subpage.


<a name="home"></a>
### Home Page

The Home Page is the starting page that allows the user to search for a phrase using the search engine. After clicking the button or pressing the enter key on the keyboard, the user is taken to the Search Page with results based on the entered phrase.

<img width="1388" alt="Zrzut ekranu 2023-10-13 o 15 15 30" src="https://github.com/abrylanska/concerts-website/assets/58529933/00b7cd0f-a2db-4e3f-8f99-2b732d9a5596">



<a name="search"></a>
### Search Page

The Search Page is the page that contains the main functionality of the website. It allows you to search for concerts based on a selected phrase, or, if the user searches for an empty value, 25 concerts appear.
<img width="1388" alt="Zrzut ekranu 2023-10-13 o 15 16 57" src="https://github.com/abrylanska/concerts-website/assets/58529933/85b6252d-8fbf-4580-a330-33fbcdd6080b">


The Search Page also has the functionality of filtering results by genre, city, and date.</br>

<img width="195" alt="Zrzut ekranu 2023-10-13 o 15 12 56" src="https://github.com/abrylanska/concerts-website/assets/58529933/53b4524b-c280-452f-ab28-3a2146710732"> <img width="195" alt="Zrzut ekranu 2023-10-13 o 15 12 31" src="https://github.com/abrylanska/concerts-website/assets/58529933/8a19657c-1da8-42a3-ac0c-9762f46e2866"> <img width="195" alt="Zrzut ekranu 2023-10-13 o 15 12 03" src="https://github.com/abrylanska/concerts-website/assets/58529933/55429556-8067-4921-976b-f071499aa1fd">






<a name="about"></a>
### About Page

The About Page presents the Concerts brand, its mission, offer and contains a CTA leading to the contact page. Everything is interspersed with animations.

![image](https://github.com/abrylanska/concerts-website/assets/58529933/1cf5da69-0934-4281-8163-c2f65067c956)


<a name="contact"></a>
### Contact Page

The contact page is a page consisting of a contact form that is connected to an external API written in Node.js to handle communication with the email server. When the user sends an e-mail, it goes to the mailbox agatabrylanska@gmail.com, and the user himself receives a thank you for sending the message to his e-mail address.

<img width="1388" alt="Zrzut ekranu 2023-10-13 o 15 20 43" src="https://github.com/abrylanska/concerts-website/assets/58529933/e4aa27f5-d237-44ed-a1a5-4911e96d234e">



<a name="favorites"></a>
### Favorites Page

The Favorites Page is a page that stores concerts saved by the user and extracts them from local storage.

<img width="1388" alt="Zrzut ekranu 2023-10-13 o 15 24 18" src="https://github.com/abrylanska/concerts-website/assets/58529933/72501d14-b3b6-4458-b078-fc9fc67516f0">


