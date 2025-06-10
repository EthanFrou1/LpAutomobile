using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LpAutomobile.Migrations
{
    /// <inheritdoc />
    public partial class AddAvisGoogle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AvisGoogle",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Auteur = table.Column<string>(type: "TEXT", nullable: false),
                    Contenu = table.Column<string>(type: "TEXT", nullable: false),
                    Note = table.Column<double>(type: "REAL", nullable: false),
                    DateAvis = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AuteurPhotoUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvisGoogle", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvisGoogle");
        }
    }
}
