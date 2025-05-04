import CameraContext from "../CameraContext";

interface View {
    display(cameraContext: CameraContext): void;
}

export default View;