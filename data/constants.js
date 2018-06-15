module.exports = {
  DOMAIN: 'https://potentialflow.com',
  SITE_NAME: 'Potential Flow',
  DEFINITIONS: [{
    id: 'potential-flow',
    name: 'Potential Flow',
    value: `Potential flow is an idealized model of fluid flow that occurs in the case of <a href="#incompressible">incompressible</a>, <a href="#inviscid">inviscid</a>, and <a href="#irrotational">irrotational</a> flow. The <a href="#velocity-field">velocity field</a> of a potential flow satisfies <a href="#laplaces-equation">Laplace's equation</a>: $\\nabla^{2} \\vec{v} = 0$.`,
  }, {
    id: 'irrotational',
    name: 'Irrotational Flow',
    value: 'Irrotational flow is defined by having a <a href="#velocity-field">velocity field</a> that satisfies $\\nabla \\times \\vec{v} = 0$ everywhere in the flow. Some exceptions may be made for singularities that violate this statement at single points. An equivalent statement is that the <a href="#velocity-field">velocity field</a> is curl free or has no <a href="#vorticity">vorticity</a>. By definition, all <a href="#potential-flow">potential flows</a> satisfy irrotationality.',
  }, {
    id: 'velocity-potential',
    name: 'Velocity Potential',
    value: 'The velocity potential is represented as $\\phi$, and exists for a flow when the velocity field is <a href="#irrotational">irrotational</a>. The potential is defined so that $\\nabla \\phi = v$.',
  }, {
    id: 'ideal-fluid',
    name: 'Ideal Fluid',
    value: 'An ideal fluid is one that is both <a href="#incompressible">incompressible</a> and <a href="#inviscid">inviscid</a>. Although in reality, all fluids are <a href="#real-fluid">real</a> and therefore are to some degree compressible and have some <a href="#viscosity">viscosity</a>, fluids like air and water often behave ideally when they flow. <a href="#potential-flow">Potential flow</a> always assumes that the fluid is ideal.',
  }, {
    id: 'inviscid',
    name: 'Inviscid Flow',
    value: 'An inviscid flow is a flow in which the effects from <a href="#viscosity">viscosity</a> are negligible. In reality, all fluids have viscosity, but fluids like air and water often flow in a way that is indistinguishable from an ideally inviscid fluid and this is considered inviscid flow.',
  }, {
    id: 'viscosity',
    name: 'Viscosity',
    value: `<div>Viscosity is a property of a fluid that relates the shear force that develops in the flow as a result of the shear in velocity, which is also know as the strain rate. The precise definition of dynamic viscosity ($\\mu$) is:</div>
      <div class="pl50 pt10 pb10">$\\tau_{ij} = \\mu \\frac{\\partial v_{i}}{\\partial x_{j}}$</div>
      <div>Kinematic viscosity is defined: $\\frac{\\mu}{\\rho}$ where $\\rho$ is the density of the fluid. In an inviscid flow it is assumed that $\\mu = 0$. Some typical values of viscosity are listed below in units of Pa·s:</div>
      <div class="pl50 pt10">
        <div>$\\mu_{\\textrm{water}} = 9 \\times 10^{-4}$</div>
        <div>$\\mu_{\\textrm{air}} = 2 \\times 10^{-6}$</div>
        <div>$\\mu_{\\textrm{honey}} = 10$</div>
      </div>`,
  }, {
    id: 'incompressible',
    name: 'Incompressible Flow',
    value: 'Incompressible flow is a flow in which any change in density in the fluid is negligible. When considering the flow as a group of many small individual fluid particles, these individual fluid particles do not undergo any volume change in an incompressible flow. Effects of compressibility occur at high speeds in flow, and therefore the Mach number of the flow can be used to estimate if the assumption of incompressibility is valid. At Mach numbers of $\\textrm{Ma} \\lt 0.3$ flows are incompressible. The fact that sound can propagate through fluids proves they must be compressible because sound is a compression wave. However, all fluids behave as incompressible at speeds that are small relative to the speed of sound.',
  }, {
    id: 'real-fluid',
    name: 'Real Fluid',
    value: 'A real fluid is a fluid that is compressible and has nonzero viscosity. All fluids are real, however, there are many cases when they can be modeled as ideal fluids with negligible error.',
  }, {
    id: 'continuum-assumption',
    name: 'Continuum Assumption',
    value: 'The continuum assumption, also known as the continuum hypothesis, is an idealization of fluid mechanics that presumes that the properties of a fluid, like velocity, pressure, and density can be defined at any infinitesimal point. Fluids are actually comprised of individual molecules, each with their own motion, but above the microscopic scale these velocities are averaged and the fluid properties can be defined continuously from point to point.',
  }, {
    id: 'velocity-field',
    name: 'Velocity Field',
    value: `The velocity field is a continuous function, $\\vec{v}(x,y,z,t)$ in 3D or $\\vec{v}(x,y,t)$ in 2D, that defines the velocity vector of the flow at every point in the fluid domain in accordance with the continuum assumption. The concept of defining the fluid velocity with a field is fundamental to potential flow theory.  The velocity field must be continuous because it must have a finite derivative, and therefore finite acceleration, if the internal forces are finite in accordance with Newton's 2<sup>nd</sup> law: $\\vec{F} = m\\vec{a}$.`,
  }, {
    id: 'differential-analysis',
    name: 'Differential Analysis',
    value: 'A field based, or <a href="#eulerian">Eulerian</a>, description of fluid mechanics allows for a point to point description of a flow and its properties. Differential analysis involves the applications of the conservation laws of mass, momentum, and energy to each point in this field description of the flow.',
  }, {
    id: 'control-volume-analysis',
    name: 'Control Volume Analysis',
    value: 'As opposed to differential analysis, control volume analysis is concerned with the application of conservation laws within and across the boundaries of a closed surface. In this case the fluid is not defined from point to point, but is instead defined macroscopically.',
  }, {
    id: 'conservation-of-mass',
    name: 'Conservation of Mass',
    value: 'A fundamental principle of classical mechanics is that matter can neither be created nor destroyed. When applied using differential analysis, conservation of mass takes on the form: $\\frac{d\\rho}{dt} + \\nabla \\cdot \\rho \\vec{v} = 0$. Potential flow assumes an incompressible flow with rho = constant and therefore $\\frac{d\\rho}{dt} = 0$, so conservation of mass simplifies to $\\nabla \\cdot \\vec{v} = 0$, which can also be stated as the divergence of the velocity field is zero or the velocity field is divergence free.',
  }, {
    id: 'laplaces-equation',
    name: `Laplace's Equation`,
    value: `<div>Laplace's equation is a second order linear partial differential equation:</div>
      <div class="pl50 pt10 pb10">$\\nabla^{2} v = 0$.</div>
      <div>$\\nabla^{2}$ is known as the Laplacian operator which in 2D is:</div>
      <div class="pl50 pt10 pb10">$\\nabla^{2} = \\frac{\\partial}{\\partial x^{2}} + \\frac{\\partial}{\\partial y^{2}}$</div>
      <div class="pb10">Therefore Laplace's equation can also be written as: $\\frac{\\partial x}{\\partial x^{2}} + \\frac{\\partial y}{\\partial y^{2}} = 0$ in 2D and $\\frac{\\partial x}{\\partial x^{2}} + \\frac{\\partial y}{\\partial y^{2}} + \\frac{\\partial z}{\\partial z^{2}} = 0$ in 3D.</div>
      <div>Due to the linearity of this equation these solutions exhibit the properties of <a href="#linear-superposition">linear superposition</a>. Therefore, any linear combination of the unique solutions is also a solution.</div>`,
  }, {
    id: 'vorticity',
    name: 'Vorticity',
    value: `Vorticity ($\\vec{\\omega}$) is defined as the curl of a velocity field: $\\vec{\\omega} = \\nabla \\times \\vec{v}$. It is a vector defined at every point in the velocity field, and in a 2D flow, it's vector direction is always into or out of the page. Intuitively this is related to <a href="#rotation">rotation</a> in the flow, and if you dropped an object into the flow vorticity would cause the object to spin. The precise definition for rotation is half of the vorticity.`,
  }, {
    id: 'rotation',
    name: 'Rotation',
    value: 'Rotation in a fluid flow is defined as $\\frac{1}{2}\\nabla \\times \\vec{v}$ or half of the <a href="#vorticity">vorticity</a>. Just like vorticity, it is a vector defined at every point in the flow.',
  }, {
    id: 'fluid',
    name: 'Fluid',
    value: 'A fluid is a state of matter that encompasses both liquids and gases. Fluids are distinguished from solids by their behavior when subjected to small shear forces: a solid statically deforms in response to a shear force, and a fluid responds by continuously flowing in response to a shear force.',
  }, {
    id: 'steady-flow',
    name: 'Steady Flow',
    value: 'Steady flow is constant through time or time independent. All the <a href="#streamlines">streamlines</a> in the flow remain fixed. This is an <a href="#eulerian">Eulerian</a> concept because field vectors are constant, but individual fluid particles may experience changes in velocity as time progresses.',
  }, {
    id: 'streamlines',
    name: 'Streamlines',
    value: 'A streamline is a theoretical line that is instantaneously tangent to the velocity of the flow everywhere. Each streamline only exist for one snapshot in time, and may change completely in the next instant, unless the flow is <a href="#steady-flow">steady</a> in which case the streamlines remain the same over time. Streamlines are an <a href="#eulerian">Eulerian</a> concept because they are based on the velocity field.',
  }, {
    id: 'stream-function',
    name: 'Stream Function',
    value: `<div>The stream function, $\\psi(x, y)$, is a scalar field that exists for all <a href="#incompressible">incompressible</a> 2D flows. It is defined so that the velocity field satisfies:</div>
      <div class="pl50 pt10 pb10">
        <div class="mb5">$u = \\frac{\\partial \\psi}{\\partial y}$</div>
        <div>$v = -\\frac{\\partial \\psi}{\\partial x}$</div>
      </div>
      <div>The stream function does not exist in 3D <a href="#velocity-field">velocity fields</a>. Lines of constant value of the stream function are <a href="#streamlines">streamlines</a> and are tangent to the velocity field.</div>`,
  }, {
    id: 'conservation-of-momentum',
    name: 'Conservation of Momentum',
    value: `Momentum is always conserved in fluid dynamics. For <a href="#inviscid">inviscid flow</a> the Euler equations are the governing set of equations that result from the statement of conservation of momentum. In the special case of <a href="#potential-flow">potential flow</a>, the Euler equations are satisfied and result in a more specific expression of conservation of momentum. The result is that any inviscid <a href="#irrotational">irrotational</a> flow will remain irrotational indefinitely. This is equivalently stated in Kelvin's theorem.`,
  }, {
    id: 'linear-superposition',
    name: 'Linear Superposition',
    value: `A linear differential equation has all linear terms and zero constant term. Linear differential equations have solutions that can be scaled and added together in any combination and remain a solution. This unique property is called linear superposition. <a href="#laplaces-equation">Laplace's equation</a> is linear, so to obtain a solution that meets the boundary conditions, a linear combination of the known solutions or flow elements can be used.`
  }, {
    id: 'eulerian',
    name: 'Eulerian Description of Flow',
    value: 'An Eulerian description of fluid mechanics is a field based description. The fluid is defined at all points by both vector and scalar fields. The <a href="#velocity-field">velocity field</a> is an example of a vector field used in Eulerian descriptions, and it is a vector defined at all points and across time: $v(x,y,z,t)$. Pressure, temperature, and density are examples of scalar fields that are also defined throughout the fluid domain in a laboratory fixed frame. This is the most commonly used description in fluid mechanics, and it is named after Leonhard Euler. The competing <a href="#lagrangian">Lagrangian description</a> of fluid mechanics is less commonly used.',
  }, {
    id: 'lagrangian',
    name: 'Lagrangian Description of Flow',
    value: 'A Lagrangian description of fluid mechanics is a particle following description. The properties of individual fluid particles or elements are tracked through time and space. The Lagrangian description of fluid mechanics is less common than the Eulerian description.',
  }, {
    id: 'material-derivative',
    name: 'Material Derivative',
    value: `<div class="pl50 pb10">$\\frac{Df}{Dt} = \\frac{\\partial f}{\\partial t} + v \\cdot \\nabla f$</div>
      <div>The material derivative is a time derivative that computes the rate of change of a quantity for a material element based on the <a href="#velocity-field">velocity field</a>. It is used to compute <a href="#lagrangian">Lagrangian flow</a> properties from an <a href="#eulerian">Eulerian flow</a> description. The second term of the derivative is known as the convective term because it accounts for the change related to the motion of the fluid.</div>`,
  }, {
    id: 'kelvins-theorem',
    name: `Kelvin's Theorem`,
    value: `<div>Kelvin's circulation theorem states that for an ideal flow with conservative body forces, there is no change in circulation for any material contour.</div>
      <div class="pl50 pt10 pb10">$\\frac{d\\Gamma}{dt} = 0$</div>
      <div>The important result of Kelvin's theorem is that an <a href="#irrotational">irrotational flow</a> will remain irrotational in the absence of viscous forces.</div>`,
  }, {
    id: 'kutta-joukowski-theorem',
    name: 'Kutta-Joukowski Theorem',
    value: `<div>Potential flow theory does not predict any drag force on objects in a flow as described by <a href="#dalamberts-paradox">D'Alambert's paradox</a>, but it can accurately predict lift force. The Kutta-Joukowski theorem relates lift force simply to the density, far field velocity, and circulation around an object:</div>
      <div class="pl50 pb10 pt10">$L = \\rho U\\Gamma$</div>
      <div>This theory can be used to determine the lift on an airfoil or rotating cylinder.</div>`,
  }, {
    id: 'dalamberts-paradox',
    name: `D'Alambert's Paradox`,
    value: `A contradictory result of potential flow theory is that there is no drag force on a body moving steadily through an unbounded fluid. This conflicts with real world experiences that show that there is significant drag force on objects moving through a fluid. Jean le Rond d'Alembert stated this contradiction in 1752. The disagreement between the mathematical theory focused hydrodynamicists and the experimental hydraulics engineers divided the field until the contradiction was reconciled when Prandtl introduced boundary layer theory in 1904.`,
  }, {
    id: 'magnus-force',
    name: 'Magnus Force',
    value: 'A rotating cylinder or sphere in a steady flow experiences a lift force known as the Magnus force. This force is predicted by <a href="#potential-flow">potential flow</a> and the <a href="#kutta-joukowski-theorem">Kutta-Joukowski theorem</a>.',
  }, {
    id: 'euler-equations',
    name: 'Euler Equations',
    value: `<div>The Euler equations are a statement of conservation of momentum for inviscid flow. They are the inviscid version of the <a href="#navier-stokes-equations">Navier-Stokes equations</a>:</div>
      <div class="pl50 pt10">$\\frac{\\partial v}{\\partial t} + v \\cdot \\nabla v = - \\frac{\\nabla p}{\\rho} + g$</div>`,
  }, {
    id: 'navier-stokes-equations',
    name: 'Navier-Stokes Equations',
    value: `<div>The Navier-Stokes equations are conservation of momentum or Newton’s second law applied to fluid flow. The are a set of coupled nonlinear second order partial differential equations:</div>
      <div class="pl50 pt10">$\\frac{\\partial v}{\\partial t} + v \\cdot \\nabla v = - \\frac{\\nabla p}{\\rho} + \\nu \\nabla^{2}v + g$</div>`,
  }, {
    id: 'bernoullis-equation',
    name: `Bernoulli's Equation`,
    value: `<div>The Bernoulli equation is a statement of conservation of energy for an inviscid flow:</div>
      <div class="pl50 pt10 pb10">$p + \\frac{1}{2}\\rho v^{2} + \\rho gh = \\textrm{constant}$</div>
      <div>It is valid for points along a streamline in inviscid flow. In the special case of potential flow, the Bernoulli equation is valid for all points in the flow.</div>`,
  }, {
    id: 'equipotentials',
    name: 'Equipotentials',
    value: 'Lines of constant potential $\\phi$ are equipotentials. In <a href="potential-flow">potential flow</a>, equipotentials are always perpendicular to streamlines.'
  }],
};