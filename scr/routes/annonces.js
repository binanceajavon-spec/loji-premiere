'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/annonces/:id',
      handler: 'annonce.findOne',
      config: {
        auth: false, // Public - tout le monde peut voir une annonce
      },
    },
    {
      method: 'POST',
      path: '/annonces/:id/increment-views',
      handler: 'annonce.incrementViews',
      config: {
        auth: false, // Public - pas besoin d'être connecté pour qu'une vue soit comptée
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/annonces/:id/increment-messages',
      handler: 'annonce.incrementMessages',
      config: {
        auth: false, // Public - quand quelqu'un clique sur WhatsApp
      },
    },
  ],
};