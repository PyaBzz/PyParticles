waterConfig = {
    dragBoxCount: 2,
    drawingCycleTime: 20,    // (Milliseconds) Determines how often the graphics are refreshed
    horizontalCellCount: 60,
    linkTearingLengthFactor: 0, // Stretch to how many times rest length before tearing. 0 to disable tearing.
    nodeMass: 10.0, // (Kg)
    damping: 0.30,    // 0 = greatest loss, 1 = lossless (potentially unstable)
    elasticStiffness: 0.26,
    elasticNonlinearity: 1.20,  // 1 is linear elasticity. Has stability problems with large numbers
    enableDynamics: 1,  // whether any movement occurs
    enableMovementAxis: {
        hor: 1,
        ver: 1,
        dep: 0,
    },
    minDep: 0,  // minimum node position in depthwise direction
    gravity: 0.0020, // (m/S^2) in depthwise direction
    linkColour: "aqua",  // CSS colour names
    linkWidth: 1,  // in pixels. 0 to disable link drawing
    drawDiagonalLinks: true,  // boolean, whether to draw diagonals
    nodeColour: "blue",  // CSS colour names
    nodeRadius: 0,  // in pixels. 0 to disable node drawing
    pinColour: "red",  // CSS colour names
    pinRadius: 5,  // in pixels. 0 to disable pin drawing
    markedNodeColour: "yellow",  // CSS colour names
    markedNodeRadius: 3,  // in pixels. 0 to disable marked node drawing
    mouseImpactRadius: 2, // diameter of mouse impact in number of cells
    rightClickAction: 1, // 0 = cut, 1 = mark   Todo: Move to UI controls
    mouseCuttingRadius: 2, // diameter of mouse cutting in number of cells
    mouseSlipFactor: 0.6, // [0-1] 0 = maximum slip, 1 = no slip
    boxedNodeBrakingFactor: 0.4, // [0-1] 0 = maximum braking, 1 = no braking
};

clothConfig = {

}