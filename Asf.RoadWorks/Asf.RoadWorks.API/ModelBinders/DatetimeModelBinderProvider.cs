//using Microsoft.AspNetCore.Mvc.ModelBinding;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Logging;
//using System;

//namespace Asf.RoadWorks.API.ModelBinders
//{
//	/// <summary>
//	/// 
//	/// </summary>
//	/// <seealso cref="Microsoft.AspNetCore.Mvc.ModelBinding.IModelBinderProvider" />
//	public class DateTimeModelBinderProvider : IModelBinderProvider
//	{
//		/// <summary>
//		/// Creates a <see cref="T:Microsoft.AspNetCore.Mvc.ModelBinding.IModelBinder" /> based on <see cref="T:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBinderProviderContext" />.
//		/// </summary>
//		/// <param name="context">The <see cref="T:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBinderProviderContext" />.</param>
//		/// <returns>
//		/// An <see cref="T:Microsoft.AspNetCore.Mvc.ModelBinding.IModelBinder" />.
//		/// </returns>
//		/// <exception cref="ArgumentNullException">context</exception>
//		public IModelBinder GetBinder(ModelBinderProviderContext context)
//		{
//			if (context == null)
//				throw new ArgumentNullException(nameof(context));

//			var modelType = context.Metadata.UnderlyingOrModelType;
//			var loggerFactory = context.Services.GetRequiredService<ILoggerFactory>();


//			return modelType == typeof(DateTime) ? new DateTimeModelBinder(loggerFactory) : null;
//		}
//	}
//}