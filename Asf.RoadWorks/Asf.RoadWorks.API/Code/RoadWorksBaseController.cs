using Microsoft.AspNetCore.Mvc;
using SmartTech.Infrastructure.API.Attributes;

namespace Asf.RoadWorks.API.Code
{
	[ApiController]
	[RouteController]
	[ApiVersion("1.0")]
	public class RoadWorksBaseController : ControllerBase
	{
	}
}