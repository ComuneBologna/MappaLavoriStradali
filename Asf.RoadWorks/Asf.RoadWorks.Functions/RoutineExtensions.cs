using Asf.RoadWorks.BusinessLogic.Models;
using Asf.RoadWorks.DataAccessLayer.Entities;
using Asf.RoadWorks.Functions.Models;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Asf.RoadWorks.Functions
{
	static class RoutineExtensions
	{
		public static RoadWorkWrite Map(this ExcelModel excelModel, long companyId, Dictionary<string, short> roadways, Dictionary<string, string> neighborhoods)
		{
			var neighborhoodNameKey = excelModel.NeighborhoodName.ExtractAlphaNum().ToLower();
			var roadwayNameKey = excelModel.RoadwayName.ToLower();


			return new RoadWorkWrite
			{
				AddressNumberFrom = excelModel.AddressNumberFrom,
				Address = excelModel.Address,
				AddressNumberTo = excelModel.AddressNumberTo,
				Category = RoadWorkCategories.Planned,
				CompanyId = companyId,
				Description = excelModel.Description,
				EstimatedEndDate = excelModel.EstimatedEndDate,
				EstimatedStartDate = excelModel.EstimatedStartDate,
				Neighborhoods = neighborhoods.ContainsKey(neighborhoodNameKey) ?
									new List<string> { neighborhoods[neighborhoodNameKey] } : new List<string>(),
				Notes = excelModel.Note,
				Roadways = roadways.ContainsKey(roadwayNameKey) ?
							new List<short> { roadways[roadwayNameKey] } : new List<short>(),
				VisualizationNotes = excelModel.VisualizationNotes,
				Year = excelModel.Year
			};
		}

		public static string ExtractAlphaNum(this string stringToClean)
		{
			if (string.IsNullOrEmpty(stringToClean))
				return stringToClean;

			return new string(stringToClean.Where(stc => char.IsLetter(stc) || char.IsDigit(stc)).ToArray());
		}
	}
}