//using Microsoft.AspNetCore.Mvc.ModelBinding;
//using Microsoft.Extensions.Logging;
//using System;
//using System.Globalization;
//using System.Threading.Tasks;

//namespace Asf.RoadWorks.API.ModelBinders
//{
//	/// <summary>
//	/// 
//	/// </summary>
//	/// <seealso cref="Microsoft.AspNetCore.Mvc.ModelBinding.IModelBinder" />
//	public class DateTimeModelBinder : IModelBinder
//	{
//		readonly ILogger _logger;

//		/// <summary>
//		/// Initializes a new instance of the <see cref="DateTimeModelBinder"/> class.
//		/// </summary>
//		/// <param name="loggerFactory">The logger factory.</param>
//		/// <exception cref="ArgumentNullException">loggerFactory</exception>
//		public DateTimeModelBinder(ILoggerFactory loggerFactory)
//		{
//			if (loggerFactory == null)
//				throw new ArgumentNullException(nameof(loggerFactory));

//			_logger = loggerFactory.CreateLogger<DateTimeModelBinder>();
//		}

//		/// <summary>
//		/// Attempts to bind a model.
//		/// </summary>
//		/// <param name="bindingContext">The <see cref="T:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBindingContext" />.</param>
//		/// <returns>
//		/// <para>
//		/// A <see cref="T:System.Threading.Tasks.Task" /> which will complete when the model binding process completes.
//		/// </para>
//		/// <para>
//		/// If model binding was successful, the <see cref="P:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBindingContext.Result" /> should have
//		/// <see cref="P:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBindingResult.IsModelSet" /> set to <c>true</c>.
//		/// </para>
//		/// <para>
//		/// A model binder that completes successfully should set <see cref="P:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBindingContext.Result" /> to
//		/// a value returned from <see cref="M:Microsoft.AspNetCore.Mvc.ModelBinding.ModelBindingResult.Success(System.Object)" />.
//		/// </para>
//		/// </returns>
//		/// <exception cref="ArgumentNullException">bindingContext</exception>
//		/// <exception cref="NotSupportedException"></exception>
//		public Task BindModelAsync(ModelBindingContext bindingContext)
//		{
//			if (bindingContext == null)
//			{
//				throw new ArgumentNullException(nameof(bindingContext));
//			}

//			var modelName = bindingContext.ModelName;
//			var valueProviderResult = bindingContext.ValueProvider.GetValue(modelName);

//			if (valueProviderResult == ValueProviderResult.None)
//			{
//				return Task.CompletedTask;
//			}

//			var modelState = bindingContext.ModelState;

//			modelState.SetModelValue(modelName, valueProviderResult);

//			var metadata = bindingContext.ModelMetadata;
//			var type = metadata.UnderlyingOrModelType;
//			var value = valueProviderResult.FirstValue;
//			var culture = valueProviderResult.Culture;
//			object model;

//			if (string.IsNullOrWhiteSpace(value))
//			{
//				model = null;
//			}
//			else if (type == typeof(DateTime))
//			{
//				model = DateTime.Parse(value, culture, DateTimeStyles.AdjustToUniversal);
//			}
//			else
//			{
//				throw new NotSupportedException();
//			}

//			if (model == null && !metadata.IsReferenceOrNullableType)
//			{
//				modelState.TryAddModelError(
//					modelName,
//					metadata.ModelBindingMessageProvider.ValueMustNotBeNullAccessor(
//						valueProviderResult.ToString()));
//			}
//			else
//			{
//				bindingContext.Result = ModelBindingResult.Success(model);
//			}

//			return Task.CompletedTask;
//		}
//	}
//}