using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LpAutomobile.Migrations
{
    /// <inheritdoc />
    public partial class EquipementAvecVehiculeId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EquipementVehicule");

            migrationBuilder.AddColumn<int>(
                name: "VehiculeId",
                table: "Equipements",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Equipements_VehiculeId",
                table: "Equipements",
                column: "VehiculeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipements_Vehicules_VehiculeId",
                table: "Equipements",
                column: "VehiculeId",
                principalTable: "Vehicules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipements_Vehicules_VehiculeId",
                table: "Equipements");

            migrationBuilder.DropIndex(
                name: "IX_Equipements_VehiculeId",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "VehiculeId",
                table: "Equipements");

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
    }
}
