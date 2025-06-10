using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LpAutomobile.Migrations
{
    /// <inheritdoc />
    public partial class AjoutTableEquipement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Equipements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nom = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EquipementVehicule",
                columns: table => new
                {
                    EquipementsId = table.Column<int>(type: "INTEGER", nullable: false),
                    VehiculesId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipementVehicule", x => new { x.EquipementsId, x.VehiculesId });
                    table.ForeignKey(
                        name: "FK_EquipementVehicule_Equipements_EquipementsId",
                        column: x => x.EquipementsId,
                        principalTable: "Equipements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipementVehicule_Vehicules_VehiculesId",
                        column: x => x.VehiculesId,
                        principalTable: "Vehicules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EquipementVehicule_VehiculesId",
                table: "EquipementVehicule",
                column: "VehiculesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EquipementVehicule");

            migrationBuilder.DropTable(
                name: "Equipements");
        }
    }
}
