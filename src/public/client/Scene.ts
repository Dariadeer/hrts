import View from "./views/View.js"

class Scene {

    public views: View[];

    constructor() {

        this.views = new Array<View>();
    }

    public pushView(v: View) {
        this.views.push(v);
    }
}

export default Scene;