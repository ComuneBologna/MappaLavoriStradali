using Asf.RoadWorks.BusinessLogic.Models;
using System.Collections.Generic;

namespace Asf.RoadWorks.Functions.Models
{
	public class RoadWorkError : RoadWorkWrite
	{
		public RoadWorkError()
		{

		}

		public RoadWorkError(RoadWorkWrite work)
		{
			Address = work.Address;
			AddressNumberFrom = work.AddressNumberFrom;
			AddressNumberTo = work.AddressNumberTo;
			Attachments = work.Attachments;
			Category = work.Category;
			CompanyId = work.CompanyId;
			CompanyReferentName = work.CompanyReferentName;
			CompanyReferentPhoneNumber = work.CompanyReferentPhoneNumber;
			Description = work.Description;
			DescriptionForCitizens = work.DescriptionForCitizens;
			EffectiveEndDate = work.EffectiveEndDate;
			EffectiveStartDate = work.EffectiveStartDate;
			EstimatedEndDate = work.EstimatedEndDate;
			EstimatedStartDate = work.EstimatedStartDate;
			GeoFeatureContainer = work.GeoFeatureContainer;
			IsOverlap = work.IsOverlap;
			Link = work.Link;
			MunicipalityReferentName = work.MunicipalityReferentName;
			MunicipalityReferentPhoneNumber = work.MunicipalityReferentPhoneNumber;
			Neighborhoods = work.Neighborhoods;
			Notes = work.Notes;
			NotScheduledStatus = work.NotScheduledStatus;
			PinPoint = work.PinPoint;
			Priority = work.Priority;
			Roadways = work.Roadways;
			TrafficChangesMeasure = work.TrafficChangesMeasure;
			VisualizationNotes = work.VisualizationNotes;
			Year = work.Year;
		}

		public List<string> Errors { get; protected set; } = new List<string>();
	}
}