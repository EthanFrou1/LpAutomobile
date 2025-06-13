using System.Net;
using System.Net.Mail;
using System.Text;
using LpAutomobile.Models;

namespace LpAutomobile.Services
{
    public interface IEmailService
    {
        Task<bool> EnvoyerContactGeneralAsync(ContactGeneralModel model);
        Task<bool> EnvoyerDemandeInfoVehiculeAsync(DemandeInfoVehiculeModel model);
        Task<bool> EnvoyerOffreVehiculeAsync(OffreVehiculeModel model);
        Task<bool> EnvoyerReservationEssaiAsync(ReservationEssaiModel model);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        // =================================
        // MÉTHODES PRINCIPALES
        // =================================

        #region Send Function email

        public async Task<bool> EnvoyerContactGeneralAsync(ContactGeneralModel model)
        {
            try
            {
                var htmlBody = GenerateContactEmailTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"🚗 Nouveau contact de {model.Nom} - LP Automobile",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email de contact envoyé avec succès pour {Email}", model.Email);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email de contact pour {Email}", model.Email);
                return false;
            }
        }

        public async Task<bool> EnvoyerDemandeInfoVehiculeAsync(DemandeInfoVehiculeModel model)
        {
            try
            {
                var htmlBody = GenerateDemandeInfoTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"📋 Demande d'informations - {model.VehiculeInfo}",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email de demande d'info envoyé pour {Email} - {VehiculeInfo}", model.Email, model.VehiculeInfo);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email de demande d'info pour {Email}", model.Email);
                return false;
            }
        }

        public async Task<bool> EnvoyerOffreVehiculeAsync(OffreVehiculeModel model)
        {
            try
            {
                var htmlBody = GenerateOffreTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"💰 OFFRE COMMERCIALE - {model.VehiculeInfo} ({model.MontantOffre:C0})",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email d'offre envoyé pour {Email} - {VehiculeInfo} - {MontantOffre:C0}",
                    model.Email, model.VehiculeInfo, model.MontantOffre);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email d'offre pour {Email}", model.Email);
                return false;
            }
        }

        public async Task<bool> EnvoyerReservationEssaiAsync(ReservationEssaiModel model)
        {
            try
            {
                var htmlBody = GenerateReservationEssaiTemplate(model);

                await SendEmailAsync(
                    to: "ethanfrou1@gmail.com",
                    subject: $"🚗 RÉSERVATION ESSAI - {model.VehiculeInfo} ({model.DateFormatee})",
                    htmlBody: htmlBody,
                    replyToEmail: model.Email
                );

                _logger.LogInformation("Email de réservation essai envoyé pour {Email} - {VehiculeInfo} - {Date}",
                    model.Email, model.VehiculeInfo, model.DateSouhaitee);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erreur lors de l'envoi de l'email de réservation essai pour {Email}", model.Email);
                return false;
            }
        }

        #endregion Send Function email

        // =================================
        // TEMPLATES HTML INTÉGRÉS
        // =================================

        #region Template Email

        private string GenerateContactEmailTemplate(ContactGeneralModel model)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Nouveau contact - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                    
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Nouveau message de contact</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                        <div style='background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin-bottom: 25px;'>
                            <h2 style='margin: 0 0 15px 0; color: #333; font-size: 20px;'>📧 Informations du contact</h2>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>👤 Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                            
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>✉️ Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #007bff; text-decoration: none;'>{model.Email}</a>
                            </div>

                            {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>📞 Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #007bff; text-decoration: none;'>{model.Telephone}</a>
                            </div>" : "")}

                            {(!string.IsNullOrEmpty(model.Sujet) ? $@"
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>📋 Sujet :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Sujet}</span>
                            </div>" : "")}
                            
                            <div>
                                <strong style='color: #007bff;'>🕒 Date :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Message :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Message.Replace("\n", "<br>")}
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <a href='mailto:{model.Email}?subject=RE: Votre contact LP Automobile' 
                           style='display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            📧 Répondre par email
                        </a>
                        {(!string.IsNullOrEmpty(model.Telephone) ? $@"
                        <a href='https://wa.me/{model.Telephone}' 
                           style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler le client
                        </a>" : "")}
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GenerateDemandeInfoTemplate(DemandeInfoVehiculeModel model)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Demande d'informations - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>📋 Demande d'informations</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                    
                        <!-- Véhicule concerné -->
                        <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 20px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h2 style='margin: 0 0 10px 0; color: white; font-size: 24px;'>🚗 {model.VehiculeInfo}</h2>
                            <p style='margin: 0 0 5px 0; color: white;'><strong>Prix :</strong> {model.Prix:C0}</p>
                            <p style='margin: 0 0 5px 0; color: white;'><strong>Année :</strong> {model.Annee} • <strong>Kilométrage :</strong> {model.Kilometrage:N0} km</p>
                            <p style='margin: 0; color: white; opacity: 0.8;'><small>ID véhicule : #{model.VehiculeId}</small></p>
                        </div>

                        <!-- Informations client -->
                        <div style='background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 20px; margin-bottom: 25px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>👤 Informations du client :</h3>
                        
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                        
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #007bff; text-decoration: none;'>{model.Email}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #007bff; text-decoration: none;'>{model.Telephone}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>Motivation :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Motivation}</span>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #007bff;'>Préférences contact :</strong>
                                <span style='color: #333;'>
                                    {(model.RecevoirEmail ? "✅ Email" : "❌ Email")} • 
                                    {(model.RecevoirAppel ? "✅ Appel" : "❌ Appel")}
                                </span>
                            </div>
                        
                            <div>
                                <strong style='color: #007bff;'>Date :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        {(!string.IsNullOrEmpty(model.Message) ? $@"
                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Message du client :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Message.Replace("\n", "<br>")}
                            </div>
                        </div>" : "")}
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <a href='mailto:{model.Email}?subject=RE: Votre demande d\'informations pour {model.VehiculeInfo}' 
                           style='display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            📧 Répondre au client
                        </a>
                        <a href='tel:{model.Telephone}' 
                           style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler maintenant
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GenerateOffreTemplate(OffreVehiculeModel model)
        {
            var urgencyColor = model.PourcentageEcart > 10 ? "#dc3545" : "#ffc107";
            var urgencyText = model.PourcentageEcart > 10 ? "⚡ OFFRE AGRESSIVE - RÉPONSE URGENTE ⚡" : "💰 NOUVELLE OFFRE COMMERCIALE";

            var repriseSection = !string.IsNullOrEmpty(model.RepriseMarque) ? $@"
            <div style='background: #e3f2fd; border: 1px solid #bbdefb; padding: 20px; margin-bottom: 20px; border-radius: 8px;'>
                <h4 style='margin: 0 0 10px 0; color: #1976d2;'>🔄 Véhicule en reprise :</h4>
                <p style='margin: 0; color: #1976d2;'>
                    <strong>{model.RepriseMarque}</strong> 
                    {(model.RepriseAnnee.HasValue ? $"({model.RepriseAnnee})" : "")} 
                    {(model.RepriseKm.HasValue ? $"• {model.RepriseKm:N0} km" : "")}
                </p>
            </div>" : "";

            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Offre commerciale - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
                
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #ffc107, #fd7e14); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>💰 Offre commerciale reçue</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                    
                        <!-- Urgence -->
                        <div style='background: {urgencyColor}; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 8px;'>
                            <strong>{urgencyText}</strong>
                        </div>

                        <!-- Offre principale -->
                        <div style='background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 25px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h2 style='margin: 0 0 15px 0; color: white; font-size: 28px;'>💰 OFFRE : {model.MontantOffre:C0}</h2>
                            <p style='margin: 0 0 10px 0; color: white; font-size: 18px;'>Prix affiché : {model.Prix:C0}</p>
                            <p style='margin: 0; color: white; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 6px;'>
                                <strong>Écart : -{model.Ecart:C0} ({model.PourcentageEcart:+0.0}%)</strong>
                            </p>
                        </div>

                        <!-- Véhicule concerné -->
                        <div style='background: linear-gradient(135deg, #6f42c1, #563d7c); color: white; padding: 20px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h3 style='margin: 0 0 10px 0; color: white; font-size: 20px;'>🚗 {model.VehiculeInfo}</h3>
                            <p style='margin: 0; color: white; opacity: 0.8;'>
                                {model.Annee} • {model.Kilometrage:N0} km • ID #{model.VehiculeId}
                            </p>
                        </div>

                        {repriseSection}

                        <!-- Informations client -->
                        <div style='background-color: #f8f9fa; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 25px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>👤 Informations du client :</h3>
                        
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                        
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #ffc107; text-decoration: none;'>{model.Email}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #ffc107; text-decoration: none;'>{model.Telephone}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Mode de paiement :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.ModePaiement}</span>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #ffc107;'>Délai d'achat :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.DateAchatFormatee}</span>
                            </div>
                        
                            <div>
                                <strong style='color: #ffc107;'>Date :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        {(!string.IsNullOrEmpty(model.Commentaires) ? $@"
                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Commentaires du client :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.Commentaires.Replace("\n", "<br>")}
                            </div>
                        </div>" : "")}
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <p style='margin: 0 0 15px 0; color: #dc3545; font-weight: bold;'>⏰ RÉPONSE RECOMMANDÉE SOUS 24H</p>
                        <a href='mailto:{model.Email}?subject=RE: Votre offre pour {model.VehiculeInfo}' 
                            style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            ✅ Accepter l'offre
                        </a>
                        <a href='tel:{model.Telephone}' 
                            style='display: inline-block; background-color: #ffc107; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Négocier par téléphone
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GenerateReservationEssaiTemplate(ReservationEssaiModel model)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='fr'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Réservation essai - LP Automobile</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>
                <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff;'>
            
                    <!-- Header -->
                    <div style='background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px 20px; text-align: center;'>
                        <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>LP AUTOMOBILE</h1>
                        <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>🚗 Demande de réservation d'essai</p>
                    </div>

                    <!-- Content -->
                    <div style='padding: 30px 20px;'>
                
                        <!-- Urgence -->
                        <div style='background: #dc3545; color: white; padding: 15px; text-align: center; margin-bottom: 20px; border-radius: 8px;'>
                            <strong>⚡ DEMANDE D'ESSAI - CONFIRMER RAPIDEMENT ⚡</strong>
                        </div>

                        <!-- Créneau demandé -->
                        <div style='background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 25px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h2 style='margin: 0 0 15px 0; color: white; font-size: 24px;'>📅 {model.DateFormatee}</h2>
                            <p style='margin: 0 0 10px 0; color: white; font-size: 18px;'><strong>Créneau :</strong> {model.Creneau}</p>
                            <p style='margin: 0; color: white;'><strong>Durée :</strong> {model.DureeFormatee}</p>
                        </div>

                        <!-- Véhicule concerné -->
                        <div style='background: linear-gradient(135deg, #6f42c1, #563d7c); color: white; padding: 20px; margin-bottom: 25px; text-align: center; border-radius: 8px;'>
                            <h3 style='margin: 0 0 10px 0; color: white; font-size: 20px;'>🚗 {model.VehiculeInfo}</h3>
                            <p style='margin: 0 0 5px 0; color: white;'><strong>Prix :</strong> {model.Prix:C0}</p>
                            <p style='margin: 0; color: white; opacity: 0.8;'>
                                {model.Annee} • {model.Kilometrage:N0} km • ID #{model.VehiculeId}
                            </p>
                        </div>

                        <!-- Informations client -->
                        <div style='background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 20px; margin-bottom: 25px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>👤 Informations du client :</h3>
                    
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Nom :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.Nom}</span>
                            </div>
                    
                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Email :</strong>
                                <a href='mailto:{model.Email}' style='color: #28a745; text-decoration: none;'>{model.Email}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Téléphone :</strong>
                                <a href='tel:{model.Telephone}' style='color: #28a745; text-decoration: none;'>{model.Telephone}</a>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Permis n° :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.NumeroPermis}</span>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Ancienneté permis :</strong>
                                <span style='color: #333; font-size: 16px;'>{model.AnciennetePermis}</span>
                            </div>

                            <div style='margin-bottom: 15px;'>
                                <strong style='color: #28a745;'>Accompagnement conseiller :</strong>
                                <span style='color: #333; font-size: 16px;'>{(model.AvecConseiller ? "✅ OUI - Prévoir un commercial" : "❌ NON - Essai autonome")}</span>
                            </div>
                    
                            <div>
                                <strong style='color: #28a745;'>Date de demande :</strong>
                                <span style='color: #333;'>{DateTime.Now:dddd d MMMM yyyy à HH:mm}</span>
                            </div>
                        </div>

                        {(!string.IsNullOrEmpty(model.DemandesSpeciales) ? $@"
                        <div style='background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px;'>
                            <h3 style='margin: 0 0 15px 0; color: #333; font-size: 18px;'>💬 Demandes spéciales :</h3>
                            <div style='background-color: #f8f9fa; padding: 15px; border-radius: 6px; line-height: 1.6; color: #333;'>
                                {model.DemandesSpeciales.Replace("\n", "<br>")}
                            </div>
                        </div>" : "")}

                        <!-- Check-list -->
                        <div style='background: #d1ecf1; padding: 20px; border-radius: 8px; border: 1px solid #bee5eb;'>
                            <h4 style='margin-top: 0; color: #0c5460;'>📋 Actions à effectuer :</h4>
                            <ul style='margin-bottom: 0; color: #0c5460;'>
                                <li><strong>Vérifier la disponibilité</strong> du véhicule pour le {model.DateFormatee}</li>
                                <li><strong>Confirmer le créneau</strong> {model.Creneau} avec le client</li>
                                <li><strong>Préparer le véhicule</strong> (nettoyage, plein d'essence, vérifications)</li>
                                <li><strong>Préparer les documents</strong> (carte grise, assurance, permis client)</li>
                                {(model.AvecConseiller ? "<li><strong>Programmer un commercial</strong> pour accompagner</li>" : "")}
                                <li><strong>Envoyer la confirmation</strong> par email ou téléphone</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div style='background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;'>
                        <p style='margin: 0 0 15px 0; color: #dc3545; font-weight: bold;'>⏰ CONFIRMER LA DISPONIBILITÉ RAPIDEMENT</p>
                        <a href='mailto:{model.Email}?subject=Confirmation essai {model.VehiculeInfo} - {model.DateFormatee}' 
                           style='display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;'>
                            ✅ Confirmer l'essai
                        </a>
                        <a href='tel:{model.Telephone}' 
                           style='display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;'>
                            📞 Appeler le client
                        </a>
                    </div>

                    <!-- Footer -->
                    <div style='background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px;'>
                        <p style='margin: 0 0 10px 0;'><strong>LP Automobile</strong></p>
                        <p style='margin: 0; opacity: 0.8;'>14 Rue Louis Piquemal, 66240 Saint-Estève<br>
                        Tél : 06 33 16 94 77</p>
                    </div>
                </div>
            </body>
            </html>";
        }

        #endregion Template Email

        // =================================
        // MÉTHODES PRIVÉES
        // =================================

        private async Task SendEmailAsync(string to, string subject, string htmlBody, string? replyToEmail = null)
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");

            using var client = new SmtpClient(smtpSettings["SmtpServer"], int.Parse(smtpSettings["Port"]))
            {
                Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"])
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["FromEmail"], smtpSettings["FromName"]),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            mailMessage.To.Add(to);

            if (!string.IsNullOrEmpty(replyToEmail))
            {
                mailMessage.ReplyToList.Add(replyToEmail);
            }

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email envoyé avec succès vers {To} - Sujet: {Subject}", to, subject);
        }
    }
}