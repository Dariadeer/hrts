import Camera from "./camera/Camera.js";
import HexMapView from "./views/HexMapView.js";
import View from "./views/View.js"

class Scene {

    public views: View[];
    public camera: Camera | undefined;

    constructor() {
        this.views = new Array<View>();
    }

    public pushView(v: View) {
        this.views.push(v);
    }

    public removeView(v: View) {
        const index = this.views.indexOf(v);
        if (index > -1) {
            this.views.splice(index, 1);
        }
    }
}

export default Scene;