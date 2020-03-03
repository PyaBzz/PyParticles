waterConfig = {
    dragBoxCount: 2,
    drawingCycleTime: 20,    // (Milliseconds) Determines how often the graphics are refreshed
    horizontalCellCount: 60,
    linkTearingLengthFactor: 0, // Stretch to how many times rest length before tearing. 0 to disable tearing.
    nodeMass: 10.0, // (Kg)
    damping: 0.30,    // 0 = greatest loss, 1 = no loss (potentially unstable)
    elasticStiffness: 0.26,
    elasticNonlinearity: 1.20,  // 1 is linear elasticity. Has problems with lengths less than 1 !! Also, brings higher order harmonics !!
    enableXAxis: 1,
    enableYAxis: 1,
    enableZAxis: 0,
    minZ: 0,
    gravity: 0.0020, // (m/S^2)
    linkColour: "aqua",
    linkWidth: 1,  // in pixels. 0 to disable link drawing
    drawDiagonalLinks: true,  // in pixels. 0 to disable link drawing
    nodeColour: "blue",
    nodeRadius: 0,  // in pixels. 0 to disable node drawing
    pinColour: "red",
    pinRadius: 5,  // in pixels. 0 to disable pin drawing
    markedNodeColour: "yellow",
    markedNodeRadius: 3,  // in pixels. 0 to disable marked node drawing
    mouseImpactRadius: 2, // diameter of mouse impact in number of cells
    rightClickAction: 1, // 0 = cut, 1 = mark
    mouseCuttingRadius: 2, // diameter of mouse cutting in number of cells
    mouseSlipFactor: 0.6, // [0-1] 0 = maximum slip, 1 = no slip
    dragBoxHoldingFactor: 0.4, // [0-1] 0 = maximum holding, 1 = no holding
};

clothConfig = {

}