import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Text from "ol/style/Text";
import { Circle as CircleStyle, Stroke } from 'ol/style.js';
import { RoadWorkStatus, RoadWorkCategories } from 'app/models/models';

export class MapUtil {
	private static selectedIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/marker.png'
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static notSelectedIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/marker.png',
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});

	private static workIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static workIconStyle2 = new Style({
		image: new Icon({
			src: 'assets/icons/maps/started-work.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	static getDefaultMapPin(label: string, selected: boolean): Style {
		return (selected) ? MapUtil.selectedIconStyle : MapUtil.notSelectedIconStyle;
	}
	static getMapPin(label: string, selected: boolean): Style {
		return new Style({
			image: new Icon({
				src: 'assets/icons/maps/marker.png',
			}),
			fill: new Fill({
				color: '#488aff'
			}),
			text: new Text({
				text: "" + label,
				offsetY: -5,
				fill: new Fill({
					color: '#660000'
				})
			})
		});
	}

	private static completedWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_verde_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});

	private static plannedWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_viola_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static inProgressdWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_rosso_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static notStartedWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_azzurro_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static comingSoonWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_giallo_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	private static defaultWorkIconStyle = new Style({
		image: new Icon({
			src: 'assets/icons/maps/work_grigio_modificato.png',
			scale: 0.2
		}),
		fill: new Fill({
			color: '#488aff'
		}),
		text: new Text({
			text: "",
			offsetY: -5,
			fill: new Fill({
				color: '#660000'
			})
		})
	});
	static getWorkPin(label: string, category: RoadWorkCategories, status: RoadWorkStatus): Style {
		switch (category) {
			case RoadWorkCategories.Planned:
				return MapUtil.plannedWorkIconStyle;
			default:
				switch (status) {
					case RoadWorkStatus.Completed:
						return MapUtil.completedWorkIconStyle
					case RoadWorkStatus.InProgress:
						return MapUtil.inProgressdWorkIconStyle;
					case RoadWorkStatus.NotStarted:
						return MapUtil.notStartedWorkIconStyle;
					case RoadWorkStatus.ComingSoon:
						return MapUtil.comingSoonWorkIconStyle;
				}
				return MapUtil.defaultWorkIconStyle

		}

	}



	static getNullStyle() {
		return new Style({
			image: new CircleStyle({
				radius: 0,
				stroke: new Stroke({
					color: 'rgba(0, 0, 0, 0)'
				}),
				fill: new Fill({
					color: 'rgba(0, 0, 0, 0)'
				})
			})
		});
	}
	static makeCLuster(label: string, selected: boolean): Style {
		return new Style({
			image: new CircleStyle({
				radius: 20,
				stroke: new Stroke({
					color: (selected) ? 'rgba(255,0,0,0.2)' : 'rgba(0,116,165, 0.2)',
				}),
				fill: new Fill({
					color: (selected) ? 'rgba(255,0,0,0.2)' : 'rgba(0,116,165, 0.4)'
				})
			}),
			text: new Text({
				text: label,
				fill: new Fill({
					color: '#fff'
				})
			})
		});
	}
}