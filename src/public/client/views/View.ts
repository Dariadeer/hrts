import CameraContext from "../camera/CameraContext";

interface View {
    display(cameraContext: CameraContext): void;
}

export default View;