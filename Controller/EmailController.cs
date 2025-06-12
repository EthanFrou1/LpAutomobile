using Microsoft.AspNetCore.Mvc;
using LpAutomobile.Services;
using LpAutomobile.Models;
using LpAutomobile.Data;
using Microsoft.EntityFrameworkCore;

namespace LpAutomobile.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ApplicationDbContext _context;

        public EmailController(IEmailService emailService, ApplicationDbContext context)
        {
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("contact-general")]
        public async Task<ActionResult<EmailResponseModel>> EnvoyerContactGeneral([FromBody] ContactGeneralModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new EmailResponseModel
                {
                    Success = false,
                    Message = "Données invalides",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            // ✅ Utiliser la nouvelle méthode avec le modèle complet
            var success = await _emailService.EnvoyerContactGeneralAsync(model);

            return Ok(new EmailResponseModel
            {
                Success = success,
                Message = success
                    ? "Votre message a été envoyé avec succès ! Nous vous répondrons rapidement."
                    : "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement."
            });
        }
    }
}