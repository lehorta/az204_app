using Microsoft.AspNetCore.Mvc;

namespace Gym.Net.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccessController : ControllerBase
{
    [HttpPost("validate")]
    public async Task<IActionResult> ValidateAccess([FromBody] AccessRequest request)
    {
        // Simula validação (aqui você chamaria a API cloud)
        await Task.Delay(500); // Simula latência

        if (request.Credential == "123456" || request.Credential == "admin")
        {
            return Ok(new AccessResponse
            {
                Success = true,
                MemberName = "João Silva",
                MemberId = "M-001",
                Photo = "https://i.pravatar.cc/300?img=12",
                AllowAccess = true,
                Message = "Acesso liberado! Bem-vindo(a).",
                Plan = "Premium - Ativo",
                ExpiresAt = DateTime.Now.AddMonths(3)
            });
        }

        return Ok(new AccessResponse
        {
            Success = false,
            AllowAccess = false,
            Message = "Credencial não encontrada ou plano inativo.",
            MemberName = null
        });
    }

    [HttpPost("open-gate")]
    public async Task<IActionResult> OpenGate()
    {
        // Aqui você chamaria o serviço da catraca
        await Task.Delay(200);
        
        return Ok(new { success = true, message = "Catraca liberada" });
    }

    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            online = true,
            cloudConnected = true,
            devices = new
            {
                gate = "connected",
                faceId = "connected",
                rfid = "connected"
            },
            timestamp = DateTime.UtcNow
        });
    }
}

public record AccessRequest(
    string Credential,
    string Type = "rfid" // rfid, facial, manual
);

public record AccessResponse
{
    public bool Success { get; init; }
    public bool AllowAccess { get; init; }
    public string? MemberName { get; init; }
    public string? MemberId { get; init; }
    public string? Photo { get; init; }
    public string Message { get; init; } = string.Empty;
    public string? Plan { get; init; }
    public DateTime? ExpiresAt { get; init; }
}
