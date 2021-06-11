import { Component, OnInit, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { GeoFeature, GeoFeatureType, GeoFeatureContainer, LabeledPoint, GeoLayer } from '../../models/GeoFeature';
import { WGS84Coordinates } from "../../models/WGS84Coordinates";
import { Draw, Modify, Select } from 'ol/interaction.js';

import geocoder from 'ol-geocoder';
import Circle from 'ol/geom/Circle';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import View from "ol/View";
import Layer from "ol/layer/Layer";
import { fromLonLat, transform, toLonLat } from 'ol/proj.js';
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import Feature from "ol/Feature";
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';
import TileLayer from "ol/layer/Tile";
import { MapUtil } from './MapUtil';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { RenameDialogComponent } from './rename-dialog/rename-dialog.component';
import MultiPoint from 'ol/geom/MultiPoint';
import { MatDialog } from "@angular/material";
import { Extent } from 'ol/extent';
import { defaults, DragPan, MouseWheelZoom } from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';

import { getCenter } from 'ol/extent';
import { StreetProvider } from './street-provider';
import { RoadWorkMapItem } from 'app/models/models';
import { MapBrowserEvent } from 'ol';

class ContainerElementView {
    geoContainer: GeoFeatureContainer;
    visibility: boolean = true;
    layers: GeoElementView[];
}

class GeoElementView {
    geoLayer: GeoLayer;
    visibility: boolean = true;
    vectorLayer: VectorLayer;
    vectorSource: VectorSource;
}

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {
    private get defaultCenterOfMap() {
        if (this.autorityCoordinates) {
            return fromLonLat([this.autorityCoordinates.longitude, this.autorityCoordinates.latitude]);
        }
        return fromLonLat([11.344354949498296, 44.49365623994365]);
    }
    @Input("autorityCoordinates") autorityCoordinates: WGS84Coordinates;

    private map: Map;
    private view: View;
    public isBingSelected = true;
    private baseLayers: Layer[] = [];
    private selectedFeature: Feature;
    private sourcePin: VectorSource = new VectorSource();
    private vectorPin: VectorLayer;
    private vectorCenterPin = new VectorLayer;
    private vectorOtherWorksCenter = new VectorLayer;
    private isEditClicked = false;
    private deleteEnabled = false;
    private isCenterPin = false;
    public isShowHideLayersClicked = false;
    private lastFeaturesDeleted: Feature[] = [];
    private draw: Draw;
    private modifyInteraction: Modify;
    private selectInteraction: Select;

    private featStyle: Style;
    private noVisibleStyle: Style = new Style({
        fill: new Fill({
            color: 'rgba(255, 255, 255, 0.0)',
        }),
        stroke: new Stroke({
            color: 'rgba(255, 255, 255, 0.0)',
        }),
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.0)'
            })
        })
    })

    private containerElementViews: ContainerElementView[] = [];
    private layersMap: GeoElementView[] = [];
    private currentContainer: ContainerElementView;
    private _currentLayer: GeoElementView;
    private set currentLayer(layer: GeoElementView) {
        this._currentLayer = layer;
        this.updateInteractions(); //update draw

    };
    private get currentLayer(): GeoElementView {
        return this._currentLayer;
    }

    showHideLayer(element: GeoElementView) {

        if (element) {
            element.vectorLayer.setVisible(element.visibility);


        }
        if ((this.currentLayer == element && element.visibility == false) || !this.currentLayer) {
            this.currentLayer = this.visibleLayer[0];
        }
        this.updateInteractions();
    }

    showHideContainer(element: ContainerElementView) {
        element.layers.forEach((layer) => {
            layer.visibility = element.visibility;
            layer.vectorLayer.setVisible(element.visibility);
        });

        if (!this.currentLayer && this.visibleLayer.length > 0) {
            this.currentLayer = this.visibleLayer[0];
        }
        if (this.visibleLayer.length == 0)
            this.currentLayer = undefined;

        this.vectorCenterPin.getSource().getFeatures().forEach((f) => {
            if (f.getProperties().linkedContainerId == element.geoContainer.id) {
                f.setStyle(MapUtil.getWorkPin("", this._startedWorks[element.geoContainer.id].category, this._startedWorks[element.geoContainer.id].status));
            }
        })

    }

    getLabelSelect(layer: GeoElementView): String {
        let label = "";
        this.containerElementViews.forEach((c) => {
            c.layers.forEach(l => {
                if (l.geoLayer.id == layer.geoLayer.id)
                    label = c.geoContainer.label + ": " + l.geoLayer.label;
            });
        });

        return label;

    }

    public get visibleLayer(): GeoElementView[] {
        let allLayers = [];
        this.containerElementViews.forEach((c) => {
            c.layers.forEach((l) => {
                allLayers.push(l);
            })
        })
        return allLayers.filter((element) => { return element.visibility });
    }
    @Output() selectedGeoContainerId: EventEmitter<any> = new EventEmitter();

    private _featuresContainers: GeoFeatureContainer[] = [];
    private _labeledPoints: LabeledPoint[];
    private _startedWorks: any = {};
    private _nearestWorks: RoadWorkMapItem[] = [];


    @Input() set startedWorks(startedWorks: any) {
        if (startedWorks) {
            this._startedWorks = startedWorks;
        }
    }
    @Input() set labeledPoints(labeledPoints: LabeledPoint[]) {
        if (labeledPoints) {
            this._labeledPoints = labeledPoints;
            if (this._featuresContainers[0]) {
                this._featuresContainers[0].points = this._labeledPoints;
            }
        }
    }

    @Input() set nearestWorks(nearestWorks: RoadWorkMapItem[]) {
        if (nearestWorks && nearestWorks.length > 0) {
            this._nearestWorks = nearestWorks;
        }
        else {
            this._nearestWorks = [];
        }
        this.otherWorksSetIcon();

    }

    otherWorksSetIcon() {
        var point;
        var featureThing; var vs = new VectorSource;
        var vs = new VectorSource;
        if (this.vectorOtherWorksCenter) {
            this.map.removeLayer(this.vectorOtherWorksCenter);
        }
        this.vectorOtherWorksCenter = new VectorLayer({
            source: vs
        });
        this._nearestWorks.forEach((e) => {

            if (e.geoFeatureContainer && e.geoFeatureContainer.center && e.geoFeatureContainer.center.latitude) {
                point = new Point(fromLonLat([e.geoFeatureContainer.center.longitude, e.geoFeatureContainer.center.latitude]));
                featureThing = new Feature({
                    name: "Thing",
                    geometry: point,
                });
                featureThing.setStyle(MapUtil.getWorkPin("", e.category, e.status));
                featureThing.setProperties({ layerId: "otherCenterPins", workId: e.id });
                vs.addFeature(featureThing);
            }

        })
        this.map.addLayer(this.vectorOtherWorksCenter);
    }



    @Input() set geoFeaturesContainer(featuresContainer: GeoFeatureContainer[]) {
        if (this._featuresContainers.length > 0) {
            this.map.removeLayer(this.vectorCenterPin);
            this.containerElementViews.forEach((container) => {
                container.visibility = false;
                container.layers.forEach((gl) => {
                    this.map.removeLayer(gl.vectorLayer);
                })
            })
            this.containerElementViews = [];
        }
        this._featuresContainers = [];

        if (featuresContainer && featuresContainer.length > 0) {
            this._featuresContainers = featuresContainer;
            if (this._labeledPoints && this._labeledPoints.length > 0) {
                this._featuresContainers[0].points = this._labeledPoints;
            }
            this._featuresContainers.forEach((container) => {
                let geoContainerView = new ContainerElementView();
                if (this.editEnabled)
                    geoContainerView.visibility = true;
                else
                    geoContainerView.visibility = false;
                geoContainerView.geoContainer = container;
                let layers = []
                if (!container.geoLayers || container.geoLayers.length == 0) {
                    container.geoLayers = [];
                    let defaultGEoLayer: GeoLayer = new GeoLayer();
                    defaultGEoLayer.geoFeatures = [];
                    defaultGEoLayer.label = "Lavori stradali";
                    defaultGEoLayer.canBeRemoved = false;
                    container.geoLayers.push(defaultGEoLayer);
                }
                //

                container.geoLayers.forEach((geoLayer) => {
                    let geoElementView: GeoElementView = new GeoElementView();
                    geoElementView.geoLayer = geoLayer;
                    geoElementView.visibility = geoContainerView.visibility;
                    geoElementView.vectorSource = new VectorSource();
                    geoElementView.vectorLayer = new VectorLayer({
                        source: geoElementView.vectorSource,
                        style: this.featStyle
                    });

                    if (geoLayer.geoFeatures) {
                        geoLayer.geoFeatures.forEach((geoInfo) => {
                            var geom;
                            if (geoInfo.featureType == GeoFeatureType.POINT) {
                                geom = new Point(fromLonLat([geoInfo.coordinates[0].longitude, geoInfo.coordinates[0].latitude]))
                            }
                            else if (geoInfo.featureType == GeoFeatureType.CIRCLE) {
                                geom = new Circle(fromLonLat([geoInfo.coordinates[0].longitude, geoInfo.coordinates[0].latitude]), geoInfo.radius);
                            }
                            else {
                                let coords = [];
                                geoInfo.coordinates.forEach(c => {
                                    coords.push(fromLonLat([c.longitude, c.latitude]))
                                })
                                if (geoInfo.featureType == GeoFeatureType.LINE) {
                                    geom = new LineString(coords)
                                }
                                else {
                                    geom = new Polygon([coords]);
                                }
                            }

                            var featurething = new Feature({
                                name: "Thing",
                                geometry: geom
                            });
                            featurething.setProperties({ linkedContainerId: container.id, linkedGeoLayerId: geoLayer.id, linkedGeomInfo: geoInfo });
                            geoElementView.vectorSource.addFeature(featurething);
                        })
                    }
                    layers.push(geoElementView);
                    geoElementView.vectorLayer.setVisible(geoContainerView.visibility);
                    this.map.addLayer(geoElementView.vectorLayer);

                });
                geoContainerView.layers = layers;
                this.containerElementViews.push(geoContainerView);
            });

            this.updateGeoContainerCenter(this._featuresContainers[0]);

            this.setPinsInCenter();

            if (this.visibleLayer.length > 0)
                this.currentLayer = this.visibleLayer[0];
        }
    }
    setPinsInCenter() {

        var point;
        var featureThing;
        var vs = new VectorSource();
        this.map.removeLayer(this.vectorCenterPin);
        this.vectorCenterPin = new VectorLayer({
            source: vs
        });
        this.containerElementViews.forEach((e) => {
            if (e.geoContainer && e.geoContainer.center && e.geoContainer.center.longitude) {
                point = new Point(fromLonLat([e.geoContainer.center.longitude, e.geoContainer.center.latitude]));
                featureThing = new Feature({
                    name: "Thing",
                    geometry: point,
                });


                if (this._startedWorks["" + e.geoContainer.id])
                    featureThing.setStyle(MapUtil.getWorkPin("", this._startedWorks[e.geoContainer.id].category, (<RoadWorkMapItem>this._startedWorks["" + e.geoContainer.id]).status));
                else
                    featureThing.setStyle(MapUtil.getWorkPin("", null, null));

                featureThing.setProperties({ linkedContainerId: e.geoContainer.id, layerId: "centerPins" });
                vs.addFeature(featureThing);
                this.vectorCenterPin.setProperties({ layerId: "centerPins" })
            }
        })
        this.map.on('singleclick', this.clickOnCenterPins);
        this.map.addLayer(this.vectorCenterPin);

    }

    private clickOnCenterPins = (evt) => {
        if (!this.isEditClicked) {
            this.map.forEachFeatureAtPixel(evt.pixel,
                (feature, layer) => {
                    if (layer) {
                        if (layer.getProperties().layerId == "centerPins") {
                            this.containerElementViews.forEach((container) => {
                                if (container.geoContainer.id == feature.getProperties().linkedContainerId) {
                                    container.layers.forEach(geov => {
                                        geov.vectorLayer.setVisible(!container.visibility);
                                        geov.visibility = !container.visibility;


                                        if (!this.currentLayer && this.visibleLayer.length > 0)
                                            this.currentLayer = this.visibleLayer[0]
                                        if (this.visibleLayer.length == 0)
                                            this.currentLayer = undefined;

                                    });
                                    container.visibility = !container.visibility;

                                }
                            })
                        }
                    }
                });
        }
    };

    setCenterFromPinsCoordinates() {

        if (this._labeledPoints) {
            var point: Point;
            var featureThing;
            var vs = new VectorSource;
            let coordinates: any[] = [0, 0];
            if (this._labeledPoints && this._labeledPoints.length > 0) {
                this._labeledPoints.forEach((coords) => {
                    if (coords) {
                        point = new Point(fromLonLat([coords.coordinates.longitude, coords.coordinates.latitude]));
                        featureThing = new Feature({
                            name: "Thing",
                            geometry: point,
                        });
                        featureThing.setStyle(MapUtil.getMapPin(coords.label, false));
                        this.sourcePin.addFeature(featureThing);
                        vs.addFeature(featureThing);
                        coordinates[0] = point.getCoordinates()[0];
                        coordinates[1] = point.getCoordinates()[1];
                    }

                });
            }
            else {

                if (this._featuresContainers && this._featuresContainers[0] && this._featuresContainers[0].center && this._featuresContainers[0].center.longitude && this._featuresContainers[0].center.latitude) {
                    coordinates = fromLonLat([this._featuresContainers[0].center.longitude, this._featuresContainers[0].center.latitude]);
                }
                else {
                    coordinates = this.defaultCenterOfMap;//fromLonLat([11.344354949498296, 44.49365623994365]);
                }
            }
            this.centerView(coordinates, 500, 14);
            this.map.updateSize();
        }
        else if (this.editEnabled) {
            this.centerView(this.defaultCenterOfMap, 500, 14);
        }
    }

    openDialog(container: ContainerElementView) {
        let dialogRef = this.dialog.open(AddDialogComponent, { data: { arrayLabels: this.getLabelsLayers() }, disableClose: true });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== "false") {
                let geoElementView: GeoElementView = new GeoElementView();
                let geoLayer: GeoLayer = new GeoLayer();
                geoElementView.vectorSource = new VectorSource();
                geoElementView.vectorLayer = new VectorLayer({
                    source: geoElementView.vectorSource,
                    style: this.featStyle
                });
                geoLayer.geoFeatures = [];
                geoLayer.label = result;

                geoElementView.geoLayer = geoLayer;
                let index = this.containerElementViews.findIndex((c) => { return c.geoContainer.id == container.geoContainer.id });
                let index2 = this._featuresContainers.findIndex((c) => { return c.id == container.geoContainer.id });
                this.containerElementViews[index].layers.push(geoElementView);
                geoElementView.visibility = this.containerElementViews[index].visibility;
                this._featuresContainers[index2].geoLayers.push(geoElementView.geoLayer);
                this.map.addLayer(geoElementView.vectorLayer);



            }

        })
    }

    @Output() featuresUpdate: EventEmitter<GeoFeatureContainer[]> = new EventEmitter<GeoFeatureContainer[]>();

    private _modifyEnabled: boolean = false;
    @Input() set editEnabled(flag: boolean) {
        this._modifyEnabled = flag;
        this.updateInteractions();
    }
    get editEnabled(): boolean { return this._modifyEnabled };

    constructor(private host: ElementRef, public dialog: MatDialog) {

        this.initBaseMap();
    }

    ngOnInit() {

        if (this.map) {
            this.map.setTarget(this.host.nativeElement.firstElementChild);
            this.updateInteractions();
            // this.centerView(this.defaultCenterOfMap, 500, 14);
        }

    }
    public ngAfterViewInit() {
        this.setDefaultLayerSelection();
        this.setCenterFromPinsCoordinates();
        this.updateMapSize();
        this.changeCursorOnFeatures();


    }

    private setDefaultLayerSelection() {
        if (this.editEnabled) {
            this.containerElementViews.forEach((container) => {
                container.visibility = true;
                container.layers[0].visibility = true;
                container.layers[0].vectorLayer.setVisible(true);
            })
        }
    }
    clickHomeButton() {
        this.map.getView().animate({
            center: this.defaultCenterOfMap,
            duration: 3000,
            zoom: 16
        });
    }
    private initDrawLayer() {

        this.featStyle = new Style({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            //colore e larghezza linee
            stroke: new Stroke({
                color: 'green',
                width: 2
            }),
            // colore punti
            image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                    color: 'yellow'
                })
            })
        });

    }


    private osm = new OSM(
        {
            url: "https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
            // url: "https://b.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
            crossOrigin: null
        }
    );
    private bings = new BingMaps({
        key: 'AvvyHc2Auj7vCVZ-wcoDz6WozY_W1BybBnt-8SXTiQJVDswJAlcIGk30eeYBqpsF',
        imagerySet: 'AerialWithLabels'
    });

    private selectedMap;
    switchMap() {

        if (this.selectedMap == this.bings) {
            this.selectedMap = this.osm;
            this.isBingSelected = false;
        }
        else {
            this.selectedMap = this.bings;
            this.isBingSelected = true;

        }
        this.baseLayers[0].setSource(this.selectedMap)

    }
    public stopPropagation(event: MapBrowserEvent) {
        if (platformModifierKeyOnly(event) && event.type == "wheel") {
            event.stopPropagation();
        }
        return platformModifierKeyOnly(event);
    }
    private initBaseMap(): void {

        if (!this.map) {
            this.initDrawLayer();
            this.vectorPin = new VectorLayer({
                source: this.sourcePin
            });
            var src = this.osm;
            this.selectedMap = this.osm;

            var tileLayer = new TileLayer({ source: src });
            if (this.baseLayers.length == 0) {
                this.baseLayers.push(tileLayer);
                this.baseLayers.push(this.vectorPin);
            }
            else {
                this.baseLayers.splice(0, 1, tileLayer);
                this.baseLayers.splice(1, 1, this.vectorPin);
            }

            this.view = new View({
                center: this.defaultCenterOfMap, //fromLonLat([11.344354949498296, 44.49365623994365]),
                projection: 'EPSG:3857',
                zoom: 16,
                maxZoom: 20,
                enableRotation: false
            })
            this.map = new Map({
                interactions: defaults({ dragPan: false, mouseWheelZoom: false }).extend([
                    new DragPan({
                        condition: (event) => {
                            return this.stopPropagation(event);
                        }
                    }),
                    new MouseWheelZoom({
                        condition: this.stopPropagation
                    })
                ]),
                layers: this.baseLayers,
                view: this.view,
            });

            let provider = new StreetProvider();

            var geoco = new geocoder('nominatim', {
                // provider: 'osm',
                provider: provider,
                lang: 'it-IT',
                // key: 'AvvyHc2Auj7vCVZ-wcoDz6WozY_W1BybBnt-8SXTiQJVDswJAlcIGk30eeYBqpsF',
                placeholder: 'Ricerca indirizzo...',
                limit: 5,
                debug: false,
                autoCompleteMinLength: 3,
                autoComplete: true,
                keepOpen: false,
                featureStyle: MapUtil.getNullStyle()
            });



            this.map.addControl(geoco);

        }
    }

    public updateMapSize() {
        if (this.map) {
            this.map.updateSize();
        }
    }

    clickEdit() {
        if (!this.currentLayer)
            this.currentLayer = this.visibleLayer[0];
        this.deleteEnabled = false;
        if (this._modifyEnabled)
            this.isEditClicked = !this.isEditClicked;
        else this.isEditClicked = false;
        this.updateInteractions();
    }

    private geometryTypeToDraw;

    getLabelsLayers(): string[] {
        let allLayers: GeoElementView[] = [];
        this.containerElementViews.forEach((c) => {
            c.layers.forEach((l) => {
                allLayers.push(l);
            })
        })
        let arrayLabels: string[] = [];
        allLayers.forEach((layer) => {
            arrayLabels.push(layer.geoLayer.label);
        });
        return arrayLabels;
    }
    renameLayer(layer: GeoElementView) {
        let dialogRef = this.dialog.open(RenameDialogComponent, { data: { arrayLabels: this.getLabelsLayers(), oldName: layer.geoLayer.label }, disableClose: true });
        dialogRef.afterClosed().subscribe((result) => {
            if (this.visibleLayer) {
                if (result !== "false") {
                    layer.geoLayer.label = result;

                }
            }
        });
    }

    showHideLayersPanel() {
        if (this.isShowHideLayersClicked) {
            this.isShowHideLayersClicked = false;
        }
        else this.isShowHideLayersClicked = true;
    }

    // deleteContainer(container: ContainerElementView) {
    // 	let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { layerLabel: container.geoContainer.id }, disableClose: true });
    // 	dialogRef.afterClosed().subscribe((result) => {
    // 		if (result !== "false") {
    // 			this.containerElementViews.forEach((cont) => {
    // 				if (container.geoContainer.id == cont.geoContainer.id) {
    // 					cont.layers.forEach((layer) => {
    // 						this.map.removeLayer(layer.vectorLayer);
    // 					})
    // 				}
    // 			})
    // 			this.containerElementViews = this.containerElementViews.filter((c) => {
    // 				return c.geoContainer.id != container.geoContainer.id;
    // 			});

    // 			this._featuresContainers = this._featuresContainers.filter((c) => {
    // 				return c.id != container.geoContainer.id;
    // 			})


    // 			if (this.containerElementViews.length > 0)
    // 				this.currentLayer = this.containerElementViews[0].layers[0];
    // 			else {
    // 				this.isShowHideLayersClicked = false;
    // 				this.currentLayer = undefined;
    // 			}
    // 			this.vectorCenterPin.getSource().getFeatures().forEach((f) => {
    // 				if(f.getProperties().linkedContainerId == container.geoContainer.id)
    // 				this.vectorCenterPin.getSource().removeFeature(f);
    // 			})

    // 		}
    // 	});
    // }

    deleteLayer(layer: GeoElementView, container: ContainerElementView) {
        let index = this.containerElementViews.findIndex((c) => { return c.geoContainer.id == container.geoContainer.id });
        let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { layerLabel: layer.geoLayer.label }, disableClose: true });
        dialogRef.afterClosed().subscribe((result) => {
            if (result !== "false") {
                this.containerElementViews.forEach((container) => {
                    container.layers = container.layers.filter((el) => {

                        return el.geoLayer.id != layer.geoLayer.id
                    })
                })

                this._featuresContainers.forEach((container) => {
                    container.geoLayers = container.geoLayers.filter((el) => {
                        return el.id != layer.geoLayer.id;
                    })
                });
                layer.visibility = false;
                this.map.removeLayer(layer.vectorLayer);
                if (this.containerElementViews.length > 0) {
                    if (this.containerElementViews[index].layers.length > 0) {

                        this.currentLayer = this.containerElementViews[index].layers[0];
                    }
                    else {
                        this.currentLayer = this.visibleLayer[0];
                    }
                }

                else {
                    this.isShowHideLayersClicked = false;
                    this.currentLayer = undefined;
                }

            }
        })

    }
    private updateInteractions() {
        if (this.selectInteraction)
            this.map.removeInteraction(this.selectInteraction);
        if (this.draw)
            this.map.removeInteraction(this.draw);
        if (this.modifyInteraction)
            this.map.removeInteraction(this.modifyInteraction);
        if (this.editEnabled && this.currentLayer) {
            // console.log("sono in modifica e posso spostare i centri")
            // this.modifyInteraction = new Modify({ source: this.vectorCenterPin.getSource() });
            // console.log("source del vector pin center", this.vectorCenterPin.getSource())
            // this.map.addInteraction(this.modifyInteraction);
            // this.modifyInteraction.on("modifyend", this.onModifyEnd);
        }
        if (this.editEnabled && this.isEditClicked && this.currentLayer) {
            let modifyCenterInteraction = new Modify({ source: this.vectorCenterPin.getSource() });
            this.modifyInteraction = new Modify({ source: this.currentLayer.vectorSource });
            this.map.addInteraction(this.modifyInteraction);
            this.map.addInteraction(modifyCenterInteraction);
            modifyCenterInteraction.on("modifyend", this.onModifyCenterPin);
            this.modifyInteraction.on("modifyend", this.onModifyEnd);
            if (this.isEditClicked && this.geometryTypeToDraw) {
                this.draw = new Draw({
                    source: this.currentLayer.vectorSource,
                    type: this.geometryTypeToDraw,
                })
                this.draw.on('drawend', this.onDrawEndEvent);
                this.map.addInteraction(this.draw);
            }
        }
        else {
            this.selectInteraction = new Select();
            this.map.addInteraction(this.selectInteraction);
            this.selectInteraction.on('select', this.onFeatureSelected);
        }
    }


    drawOnMap(geometryType: String) {
        this.geometryTypeToDraw = geometryType;
        this.updateInteractions();
    }
    @Output() nearestWorkSelected: EventEmitter<any> = new EventEmitter();

    private onFeatureSelected = (evt) => {
        if (evt.selected && evt.selected.length > 0) {
            this.deleteEnabled = true;
            evt.selected.forEach((element: Feature) => {
                if (element.getProperties() && element.getProperties().linkedContainerId) {
                    this.selectedGeoContainerId.emit(element.getProperties().linkedContainerId);
                    if (element.getProperties().layerId && element.getProperties().layerId == "centerPins") {
                        this.isCenterPin = true;
                    }
                    else {
                        this.isCenterPin = false;
                    }
                }
                this.selectedFeature = element;
                if (element.getProperties().layerId == "otherCenterPins") {
                    this.deleteEnabled = false;
                    if (element.getProperties().workId)
                        this.nearestWorkSelected.emit(element.getProperties().workId);
                }

            });
        }

        else
            this.deleteEnabled = false;
        this.selectInteraction.getFeatures().clear();


    };


    private onModifyCenterPin = (evt) => {
        var coordinates: WGS84Coordinates;
        if (evt.features) {
            evt.features.forEach(f => {
                let lonLat = transform(f.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                coordinates = new WGS84Coordinates(lonLat[0], lonLat[1]);
                this._featuresContainers.forEach((container) => {
                    if (container.id == f.getProperties().linkedContainerId) {
                        container.center = coordinates;
                    }
                })
            });
            this.featuresUpdate.emit(this._featuresContainers);
        }
    }

    private onModifyEnd = (evt) => {
        if (evt.features) {
            var selectedContainer;
            evt.features.forEach(f => {
                var gFeature: GeoFeature = f.getProperties().linkedGeomInfo;
                var coordinates: WGS84Coordinates[] = [];
                let radius = undefined;
                if (gFeature.featureType == GeoFeatureType.POINT) {
                    let lonLat = transform(f.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                    coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
                }
                else if (gFeature.featureType == GeoFeatureType.CIRCLE) {
                    let lonLat = transform(f.getGeometry().getCenter(), 'EPSG:3857', 'EPSG:4326');
                    radius = f.getGeometry().getRadius();
                    coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
                }
                else if (gFeature.featureType == GeoFeatureType.LINE) {
                    f.getGeometry().getCoordinates().forEach(element => {
                        let lonLat = transform(element, 'EPSG:3857', 'EPSG:4326');
                        coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
                    });
                }
                else {
                    f.getGeometry().getCoordinates()[0].forEach(element => {
                        let lonLat = transform(element, 'EPSG:3857', 'EPSG:4326');
                        coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
                    });
                }
                gFeature.coordinates = coordinates
                gFeature.radius = radius;

                this._featuresContainers.forEach((container) => {
                    container.geoLayers.forEach((layer) => {
                        layer.geoFeatures.forEach((gf) => {
                            if (gf.id == f.getProperties().linkedGeomInfo.id) {
                                selectedContainer = container;
                                Object.assign(gf, gFeature);
                            }
                        })
                    })
                })

            });


        }
        // this.updateGeoContainerCenter(selectedContainer);

        this.featuresUpdate.emit(this._featuresContainers);
    };

    private updateGeoContainerCenter(selectedContainer: GeoFeatureContainer) {
        let multiPoint: MultiPoint = new MultiPoint([]);
        // TODO: modificare il calcolo del centro aggiungendo i points del container
        if (selectedContainer) {
            selectedContainer.geoLayers.forEach((geoLayer) => {
                geoLayer.geoFeatures.forEach(geoFeature => {
                    geoFeature.coordinates.forEach(coord => {
                        let l = fromLonLat([coord.longitude, coord.latitude]);
                        multiPoint.appendPoint(new Point(l));

                    });
                })
            })
            if (selectedContainer.points) {
                selectedContainer.points.forEach(lp => {
                    let c = fromLonLat([lp.coordinates.longitude, lp.coordinates.latitude]);
                    multiPoint.appendPoint(new Point(c));
                })
            }
            if (multiPoint.getExtent()) {
                let ex: Extent = multiPoint.getExtent();
                let center = toLonLat(getCenter(ex));
                if (center & center[0] & center[1]) {
                    selectedContainer.center = new WGS84Coordinates(
                        center[0], center[1]
                    );
                }
            }
        }
        this.setPinsInCenter();

    }

    public undo() {
        // var undoFeature: Feature;
        // if (this.lastFeaturesDeleted.length > 0 ) {
        // 	undoFeature = this.lastFeaturesDeleted.pop();
        // 	undoFeature.setStyle(this.featStyle);
        // 	this.currentLayer.vectorSource.addFeature(undoFeature);
        // }
    }
    public deleteSelectedFeature() {
        if (this.selectedFeature) {
            let selectedId = this.selectedFeature.getProperties().linkedGeomInfo.id
            this.lastFeaturesDeleted.push(this.selectedFeature);
            this.deleteEnabled = false;

            this._featuresContainers.forEach((container) => {
                container.geoLayers.forEach((layer) => {
                    layer.geoFeatures.forEach(gf => {
                        if (gf.id == this.selectedFeature.getProperties().linkedGeomInfo.id) {
                            layer.geoFeatures = layer.geoFeatures.filter((e) => { return e.id != this.selectedFeature.getProperties().linkedGeomInfo.id })
                            //delete feature from geolayer
                            this.containerElementViews.forEach((c) => {
                                c.layers.forEach((l) => {
                                    if (this.selectedFeature.getProperties().linkedGeoLayerId == l.geoLayer.id)
                                        l.vectorSource.removeFeature(this.selectedFeature);
                                })
                            })
                            this.updateGeoContainerCenter(container);
                        }
                    });
                })
            })
            this.selectedFeature.setStyle(this.noVisibleStyle)
        }
    }
    private onDrawEndEvent = (evt) => {
        var gFeature: GeoFeature;
        var gFeatureType: GeoFeatureType;

        switch (this.geometryTypeToDraw) {
            case "Point":
                gFeatureType = GeoFeatureType.POINT;
                break;
            case "LineString":
                gFeatureType = GeoFeatureType.LINE;
                break;
            case "Circle":
                gFeatureType = GeoFeatureType.CIRCLE;
                break;
            case "Polygon":
                gFeatureType = GeoFeatureType.POLYGON;
                break;
            default:
                return;
        }
        var coordinates: WGS84Coordinates[] = [];
        let f: Feature = evt.feature;

        let radius = undefined;
        if (gFeatureType == GeoFeatureType.POINT) {
            let lonLat = transform(evt.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
        }
        else if (gFeatureType == GeoFeatureType.CIRCLE) {
            let lonLat = transform(evt.feature.getGeometry().getCenter(), 'EPSG:3857', 'EPSG:4326');
            radius = evt.feature.getGeometry().getRadius();
            coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
        }
        else if (gFeatureType == GeoFeatureType.LINE) {
            evt.feature.getGeometry().getCoordinates().forEach(element => {
                let lonLat = transform(element, 'EPSG:3857', 'EPSG:4326');
                coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
            });
        }
        else {
            evt.feature.getGeometry().getCoordinates()[0].forEach(element => {
                let lonLat = transform(element, 'EPSG:3857', 'EPSG:4326');
                coordinates.push(new WGS84Coordinates(lonLat[0], lonLat[1]));
            });

        }
        gFeature = new GeoFeature(gFeatureType, coordinates, radius);
        let selectedContainer: GeoFeatureContainer;
        selectedContainer = this._featuresContainers[0];
        this._featuresContainers.forEach((container) => {
            container.geoLayers.forEach((geoLayer) => {
                if (geoLayer.id == this.currentLayer.geoLayer.id) {
                    selectedContainer = container;
                    geoLayer.geoFeatures.push(gFeature);
                    f.setProperties({ linkedGeomInfo: gFeature, linkedGeoLayerId: this.currentLayer.geoLayer.id, linkedContainerId: container.id });
                }
            })
        })

        // this.updateGeoContainerCenter(selectedContainer)
        this.featuresUpdate.emit(this._featuresContainers);
    }

    log() {
        // console.log(JSON.stringify(this._featuresContainers));
    }


    private centerView(coordinates, duration: number, zoomLevel?: number) {
        if (zoomLevel) {
            var view = this.map.getView();
            view.animate({
                center: coordinates,
                zoom: zoomLevel,
                duration: (duration) ? duration : 500
            });
        }
        else {
            var view = this.map.getView();
            view.animate({
                center: coordinates,
                duration: (duration) ? duration : 500
            });
        }

    }

    changeCursorOnFeatures() {
        this.map.on("pointermove", function (evt) {
            var hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                return true;
            });
            if (hit) {
                this.getTarget().style.cursor = 'pointer';
            } else {
                this.getTarget().style.cursor = '';
            }
        });
    }
}
