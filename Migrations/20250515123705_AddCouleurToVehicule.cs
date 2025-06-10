using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LpAutomobile.Migrations
{
    /// <inheritdoc />
    public partial class AddCouleurToVehicule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Couleur",
                table: "Vehicules",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Couleur",
                table: "Vehicules");
        }
    }
}
