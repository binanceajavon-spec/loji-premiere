'use strict';

/**
 * annonce controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::annonce.annonce', ({ strapi }) => ({
  
  // Surcharger la méthode findOne pour incrémenter automatiquement les vues
  async findOne(ctx) {
    const { id } = ctx.params;
    
    // Appeler la méthode findOne originale pour récupérer l'annonce
    const response = await super.findOne(ctx);
    
    // Incrémenter le compteur de vues en arrière-plan (ne pas bloquer la réponse)
    try {
      await strapi.entityService.update('api::annonce.annonce', id, {
        data: {
          views: (response.data.attributes.views || 0) + 1
        }
      });
      console.log(`✅ Vue comptée pour l'annonce ${id}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'incrémentation des vues:`, error);
      // Ne pas échouer la requête à cause de ça
    }
    
    return response;
  },
  
  // Endpoint spécial pour incrémenter les vues (utile pour les appels manuels)
  async incrementViews(ctx) {
    const { id } = ctx.params;
    
    try {
      // Récupérer l'annonce actuelle
      const annonce = await strapi.entityService.findOne('api::annonce.annonce', id);
      
      if (!annonce) {
        return ctx.notFound('Annonce non trouvée');
      }
      
      // Calculer les nouvelles vues
      const currentViews = annonce.views || 0;
      const newViews = currentViews + 1;
      
      // Mettre à jour
      const updated = await strapi.entityService.update('api::annonce.annonce', id, {
        data: {
          views: newViews
        }
      });
      
      return ctx.send({
        success: true,
        views: newViews,
        message: 'Vue comptabilisée avec succès'
      });
      
    } catch (error) {
      console.error('Erreur incrementViews:', error);
      return ctx.internalServerError('Erreur lors de l\'incrémentation des vues');
    }
  },
  
  // Endpoint pour incrémenter les messages WhatsApp
  async incrementMessages(ctx) {
    const { id } = ctx.params;
    
    try {
      const annonce = await strapi.entityService.findOne('api::annonce.annonce', id);
      
      if (!annonce) {
        return ctx.notFound('Annonce non trouvée');
      }
      
      const currentMessages = annonce.messages || 0;
      const newMessages = currentMessages + 1;
      
      const updated = await strapi.entityService.update('api::annonce.annonce', id, {
        data: {
          messages: newMessages
        }
      });
      
      return ctx.send({
        success: true,
        messages: newMessages
      });
      
    } catch (error) {
      console.error('Erreur incrementMessages:', error);
      return ctx.internalServerError('Erreur lors de l\'incrémentation des messages');
    }
  },
  
  // Endpoint pour incrémenter les visites programmées
  async incrementVisits(ctx) {
    const { id } = ctx.params;
    
    try {
      const annonce = await strapi.entityService.findOne('api::annonce.annonce', id);
      
      if (!annonce) {
        return ctx.notFound('Annonce non trouvée');
      }
      
      const currentVisits = annonce.visits || 0;
      const newVisits = currentVisits + 1;
      
      const updated = await strapi.entityService.update('api::annonce.annonce', id, {
        data: {
          visits: newVisits
        }
      });
      
      return ctx.send({
        success: true,
        visits: newVisits
      });
      
    } catch (error) {
      console.error('Erreur incrementVisits:', error);
      return ctx.internalServerError('Erreur lors de l\'incrémentation des visites');
    }
  }
}));