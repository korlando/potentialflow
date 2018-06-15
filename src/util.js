import * as flowActions from './actions/flowActions';
import store from './store/store';
import {
  UNIFORM,
  POINT_SOURCE,
  POINT_VORTEX,
  DIPOLE,
  CORNER,
} from './constants/flowTypes';

export const bootstrapFlows = (flowIds, flowMap, maxIndex) => {
  store.dispatch(flowActions.bootstrapFlows(flowIds, flowMap, maxIndex));
};

export const addFlow = (type, inputs, flowFcns, flowStrs) => {
  store.dispatch(flowActions.addFlow({ type, inputs, flowFcns, flowStrs }));
};

export const addBulkFlows = (flows, name) => {
  store.dispatch(flowActions.addBulkFlows({ flows, name }));
};

export const editFlow = (flowId, inputChanges, flowFcns, flowStrs) => {
  store.dispatch(flowActions.editFlow(flowId, inputChanges, flowFcns, flowStrs));
};

export const editFlowForm = (flowType, inputChanges) => {
  store.dispatch(flowActions.editFlowForm(flowType, inputChanges));
};

export const removeFlow = (flowId) => {
  store.dispatch(flowActions.removeFlow(flowId));
};

export const removeAllFlows = () => {
  store.dispatch(flowActions.removeAllFlows());
};

export const editFlowView = (view) => {
  store.dispatch(flowActions.editFlowView(view));
};

export const undoFlowHistory = () => {
  store.dispatch(flowActions.undoFlowHistory());
};

export const redoFlowHistory = () => {
  store.dispatch(flowActions.redoFlowHistory());
};

export const diffTeX = (first, second) => {
  if(second < 0) {
    return `${first} + ${-second}`;
  } else if(!second) {
    return first;
  }
  return `${first} - ${second}`;
};

export const fracTeX = (numerator, denominator) => (
  `\\frac{${numerator}}{${denominator}}`
);

export const sqrtTeX = (x) => (
  `\\sqrt[]{${x}}`
);

export const radiusSqTeX = (x0, y0) => {
  const xTerm = x0 === 0 ? 'x' : `(${diffTeX('x', x0)})`;
  const yTerm = y0 === 0 ? 'y' : `(${diffTeX('y', y0)})`;
  return `${xTerm}^2 + ${yTerm}^2`
};

export const radiusTeX = (x0, y0) => (
  sqrtTeX(radiusSqTeX(x0, y0))
);

export const over2PiTeX = (x) => (
  fracTeX(x, '2\\pi')
);

export const getRadiusSq = (xDiff, yDiff) => (
  Math.pow(xDiff, 2) + Math.pow(yDiff, 2)
);

export const getRadius = (xDiff, yDiff) => (
  Math.sqrt(getRadiusSq(xDiff, yDiff))
);

export const over2Pi = (x) => (
  x / (2 * Math.PI)
);

export const uniformFcns = {
  vp: (U, V) => {
    return (x, y) => {
      return U * x + V * y;
    };
  },
  vpTeX: (U, V) => {
    if(V === 1) {
      V = '';
    }
    if(U === 0 && V === 0) {
      return '0';
    }
    const UStr = U === 1 ? 'x' : (U === -1 ? '-x' : (U === 0 ? '' : `${U}x`));
    const VStr = V < 0 ? (V === -1 ? '-y' : `${V}y`) : (V === 0 ? '' : `${U === 0 ? '' : '+'} ${V}y`);
    return `${UStr} ${VStr}`;
  },
  stream: (U, V) => {
    return (x, y) => {
      return -V * x + U * y;
    };
  },
  streamTeX: (U, V) => {
    if(U === 1) {
      U = '';
    }
    if(U === 0 && V === 0) {
      return '0';
    }
    const VStr = V === 1 ? '-x' : (V === -1 ? 'x' : (V === 0 ? '' : `-${V}x`));
    const UStr = U < 0 ? (U === -1 ? '-y' : `${U}y`) : (U === 0 ? '' : `${V === 0 ? '' : '+'} ${U}y`);
    return `${VStr} ${UStr}`;
  },
  xVel: (U, V) => {
    return (x, y) => U;
  },
  xVelTeX: (U, V) => U,
  yVel: (U, V) => {
    return (x, y) => V;
  },
  yVelTeX: (U, V) => V,
};

export const pointSourceFcns = {
  vp: (m, x0, y0) => {
    return (x, y) => {
      const radius = getRadius(x - x0, y - y0);
      if(radius === 0) {
        return -Infinity;
      }
      return over2Pi(m) * Math.log(radius);
    };
  },
  vpTeX: (m, x0, y0) => {
    if(m === 0) {
      return '0';
    }
    return `${over2PiTeX(m)}ln(${radiusTeX(x0, y0)})`;
  },
  stream: (m, x0, y0) => {
    return (x, y) => over2Pi(m) * Math.atan2(y - y0, x - x0);
  },
  streamTeX: (m, x0, y0) => {
    if (m === 0) {
      return '0';
    }
    return `${over2PiTeX(m)}tan^{-1}(${fracTeX(diffTeX('y', y0), diffTeX('x', x0))})`;
  },
  xVel: (m, x0, y0) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if(radiusSq === 0) {
        return Infinity;
      }

      return over2Pi(m) * xDiff / radiusSq;
    };
  },
  xVelTeX: (m, x0, y0) => {
    if(m === 0) {
      return '0';
    }
    return over2PiTeX(m) + fracTeX(diffTeX('x', x0), radiusSqTeX(x0, y0));
  },
  yVel: (m, x0, y0) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if(radiusSq === 0) {
        return Infinity;
      }

      return over2Pi(m) * yDiff / radiusSq;
    };
  },
  yVelTeX: (m, x0, y0) => {
    if (m === 0) {
      return '0';
    }
    return over2PiTeX(m) + fracTeX(diffTeX('y', y0), radiusSqTeX(x0, y0));
  },
};

export const pointVortexFcns = {
  vp: (gamma, x0, y0) => {
    return (x, y) => over2Pi(gamma) * Math.atan2(y - y0, x - x0);
  },
  vpTeX: (gamma, x0, y0) => {
    if (gamma === 0) {
      return '0';
    }
    return `${over2PiTeX(gamma)}tan^{-1}(${fracTeX(diffTeX('y', y0), diffTeX('x', x0))})`
  },
  stream: (gamma, x0, y0) => {
    return (x, y) => -over2Pi(gamma) * Math.log(getRadius(x - x0, y - y0));
  },
  streamTeX: (gamma, x0, y0) => {
    if (gamma === 0) {
      return '0';
    }
    return `-${over2PiTeX(gamma)}ln(${radiusTeX(x0, y0)})`
  },
  xVel: (gamma, x0, y0) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        return Infinity;
      }
      return over2Pi(gamma) * -yDiff / radiusSq;
    };
  },
  xVelTeX: (gamma, x0, y0) => {
    if (gamma === 0) {
      return '0';
    }
    return over2PiTeX(gamma) + fracTeX(`-(${diffTeX('y', y0)})`, radiusSqTeX(x0, y0))
  },
  yVel: (gamma, x0, y0) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        return Infinity;
      }
      return over2Pi(gamma) * xDiff / radiusSq;
    };
  },
  yVelTeX: (gamma, x0, y0) => {
    if (gamma === 0) {
      return '0';
    }
    return over2PiTeX(gamma) + fracTeX(diffTeX('x', x0), radiusSqTeX(x0, y0))
  },
};

export const dipoleFcns = {
  vp: (mu, x0, y0, alpha) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        // handle divide by 0
        return Infinity;
      }
      return over2Pi(-mu) * (
        xDiff * Math.cos(alpha) +
        yDiff * Math.sin(alpha)
      ) / radiusSq;
    };
  },
  vpTeX: (mu, x0, y0, alpha) => {
    if (mu === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = Number(x0) === 0 ? 'x' : `(${xDiff})`;
    const yTerm = Number(y0) === 0 ? 'y' : `(${yDiff})`;
    const muStr = (typeof mu === 'string') ? `-${mu}` : -mu;
    const cos = Math.cos(Number(alpha));
    const sin = Math.sin(Number(alpha));
    return over2PiTeX(muStr) + fracTeX(`${cos === 0 ? '' : `${xTerm}cos(${alpha})`}${sin === 0 ? '' : `${cos === 0 ? '' : '+'} ${yTerm}sin(${alpha})`}`, radiusSqTeX(x0, y0));
  },
  stream: (mu, x0, y0, alpha) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        return Infinity;
      }

      return over2Pi(mu) * (
        xDiff * Math.sin(alpha) +
        yDiff * Math.cos(alpha)
      ) / radiusSq;
    };
  },
  streamTeX: (mu, x0, y0, alpha) => {
    if (mu === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = Number(x0) === 0 ? 'x' : `(${xDiff})`;
    const yTerm = Number(y0) === 0 ? 'y' : `(${yDiff})`;
    const cos = Math.cos(Number(alpha));
    const sin = Math.sin(Number(alpha));
    return over2PiTeX(mu) + fracTeX(`${sin === 0 ? '' : `${xTerm}sin(${alpha})`} ${cos === 0 ? '' : `${sin === 0 ? '' : '+'} ${yTerm}cos(${alpha})`}`, radiusSqTeX(x0, y0));
  },
  xVel: (mu, x0, y0, alpha) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        return Infinity;
      }
      const sinA = Math.sin(alpha);
      const cosA = Math.cos(alpha);
      return -over2Pi(mu) * (radiusSq * cosA - 2 * xDiff * (xDiff * cosA + yDiff * sinA)) / Math.pow(radiusSq, 2);
    };
  },
  xVelTeX: (mu, x0, y0, alpha) => {
    if (Number(mu) === 0) {
      return '0';
    }
    const muTerm = Number(mu) < 0 ? over2PiTeX(-Number(mu)) : `-${over2PiTeX(mu)}`;
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = Number(x0) === 0 ? 'x' : `(${xDiff})`;
    const yTerm = Number(y0) === 0 ? 'y' : `(${yDiff})`;
    const radiusSq = radiusSqTeX(x0, y0);
    const sin = `sin(${alpha})`;
    const cos = `cos(${alpha})`;
    return muTerm + fracTeX(`(${radiusSq})${cos} - 2${xTerm}(${xTerm}${cos} + ${yTerm}${sin})`, `(${radiusSq})^2`);
  },
  yVel: (mu, x0, y0, alpha) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radiusSq = getRadiusSq(xDiff, yDiff);
      if (radiusSq === 0) {
        return Infinity;
      }
      const sinA = Math.sin(alpha);
      const cosA = Math.cos(alpha);
      return -over2Pi(mu) * (radiusSq * sinA - 2 * yDiff * (xDiff * cosA + yDiff * sinA)) / Math.pow(radiusSq, 2);
    };
  },
  yVelTeX: (mu, x0, y0, alpha) => {
    if (Number(mu) === 0) {
      return '0';
    }
    const muTerm = Number(mu) < 0 ? over2PiTeX(-Number(mu)) : `-${over2PiTeX(mu)}`;
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = Number(x0) === 0 ? 'x' : `(${xDiff})`;
    const yTerm = Number(y0) === 0 ? 'y' : `(${yDiff})`;
    const radiusSq = radiusSqTeX(x0, y0);
    const sin = `sin(${alpha})`;
    const cos = `cos(${alpha})`;
    return muTerm + fracTeX(`(${radiusSq})${sin} - 2${yTerm}(${xTerm}${cos} + ${yTerm}${sin})`, `(${radiusSq})^2`);
  },
};

const calcAtan = (y, x) => Math.atan2(y, x);

export const cornerFcns = {
  vp: (x0, y0, theta0, alpha, beta) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radius = getRadius(xDiff, yDiff);
      const atan = calcAtan(yDiff, xDiff);
      return beta * Math.pow(radius, alpha) * Math.cos(alpha * (atan - theta0));
    };
  },
  vpTeX: (x0, y0, theta0, alpha, beta) => {
    if(alpha === 0 || beta === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const radius = radiusTeX(x0, y0);
    return `${beta === 1 ? '' : beta}(${radius})^{${alpha}}cos(${alpha === 1 ? '' : alpha}(tan^{-1}(${fracTeX(yDiff, xDiff)}) ${Number(theta0) === 0 ? '' : `- ${theta0}`}))`;
  },
  stream: (x0, y0, theta0, alpha, beta) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const radius = getRadius(xDiff, yDiff);
      const atan = calcAtan(yDiff, xDiff);
      return beta * Math.pow(radius, alpha) * Math.sin(alpha * (atan - theta0));
    };
  },
  streamTeX: (x0, y0, theta0, alpha, beta) => {
    if(alpha === 0 || beta === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    return `${beta === 1 ? '' : beta}(${radiusTeX(x0, y0)})^{${alpha}}sin(${alpha === 1 ? '' : alpha}(tan^{-1}(${fracTeX(yDiff, xDiff)}) ${Number(theta0) === 0 ? '' : `- ${theta0}`}))`;
  },
  xVel: (x0, y0, theta0, alpha, beta) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const atan = calcAtan(xDiff, yDiff);
      return beta * alpha * Math.pow(getRadiusSq(xDiff, yDiff), (alpha/2) - 1) * (xDiff * Math.cos(alpha * (atan - theta0)) + yDiff * Math.sin(alpha * (atan - theta0)))
    };
  },
  xVelTeX: (x0, y0, theta0, alpha, beta) => {
    if(alpha === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = x0 === 0 ? 'x' : `(${xDiff})`;
    const yTerm = y0 === 0 ? 'y' : `(${yDiff})`;
    const alphaBeta = typeof alpha === 'string' ? `${beta} ${alpha}` : Number(alpha) * Number(beta);
    const inner = `${alphaBeta === 1 ? '' : alphaBeta + '('}tan^{-1}(${fracTeX(yDiff, xDiff)}) ${theta0 === 0 ? '' : `- ${theta0}`}${alphaBeta === 1 ? '' : ')'}`;
    return `${alpha === 1 ? '' : alpha}(${radiusSqTeX(x0, y0)})^{${fracTeX(alpha, 2)} - 1}[${xTerm}cos(${inner}) + ${yTerm}sin(${inner})]`;
  },
  yVel: (x0, y0, theta0, alpha, beta) => {
    return (x, y) => {
      const xDiff = x - x0;
      const yDiff = y - y0;
      const atan = calcAtan(xDiff, yDiff);
      return beta * alpha * Math.pow(getRadiusSq(xDiff, yDiff), (alpha/2) - 1) * (yDiff * Math.cos(alpha * (atan - theta0)) + xDiff * Math.sin(alpha * (atan - theta0)))
    };
  },
  yVelTeX: (x0, y0, theta0, alpha, beta) => {
    if(alpha === 0) {
      return '0';
    }
    const xDiff = diffTeX('x', x0);
    const yDiff = diffTeX('y', y0);
    const xTerm = x0 === 0 ? 'x' : `(${xDiff})`;
    const yTerm = y0 === 0 ? 'y' : `(${yDiff})`;
    const alphaBeta = typeof alpha === 'string' ? `${beta} \\cdot ${alpha}` : Number(alpha) * Number(beta);
    const inner = `${alphaBeta === 1 ? '' : alphaBeta + '('}tan^{-1}(${fracTeX(yDiff, xDiff)}) ${theta0 === 0 ? '' : `- ${theta0}`}${alphaBeta === 1 ? '' : ')'}`;
    return `${alpha === 1 ? '' : alpha}(${radiusSqTeX(x0, y0)})^{${fracTeX(alpha, 2)} - 1}[${yTerm}cos(${inner}) + ${xTerm}sin(${inner})]`;
  },
};

export const uniformEqs = {
  vp: uniformFcns.vpTeX('U', 'V'),
  stream: uniformFcns.streamTeX('U', 'V'),
  xVel: uniformFcns.xVelTeX('U', 'V'),
  yVel: uniformFcns.yVelTeX('U', 'V'),
};

export const pointSourceEqs = {
  vp: pointSourceFcns.vpTeX('m', 'x_0', 'y_0'),
  stream: pointSourceFcns.streamTeX('m', 'x_0', 'y_0'),
  xVel: pointSourceFcns.xVelTeX('m', 'x_0', 'y_0'),
  yVel: pointSourceFcns.yVelTeX('m', 'x_0', 'y_0'),
};

export const pointVortexEqs = {
  vp: pointVortexFcns.vpTeX('\\Gamma', 'x_0', 'y_0'),
  stream: pointVortexFcns.streamTeX('\\Gamma', 'x_0', 'y_0'),
  xVel: pointVortexFcns.xVelTeX('\\Gamma', 'x_0', 'y_0'),
  yVel: pointVortexFcns.yVelTeX('\\Gamma', 'x_0', 'y_0'),
};

export const dipoleEqs = {
  vp: dipoleFcns.vpTeX('\\mu', 'x_0', 'y_0', '\\alpha'),
  stream: dipoleFcns.streamTeX('\\mu', 'x_0', 'y_0', '\\alpha'),
  xVel: dipoleFcns.xVelTeX('\\mu', 'x_0', 'y_0', '\\alpha'),
  yVel: dipoleFcns.yVelTeX('\\mu', 'x_0', 'y_0', '\\alpha'),
};

export const cornerEqs = {
  vp: cornerFcns.vpTeX('x_0', 'y_0', '\\theta_0', '\\alpha', '\\beta'),
  stream: cornerFcns.streamTeX('x_0', 'y_0', '\\theta_0', '\\alpha', '\\beta'),
  xVel: cornerFcns.xVelTeX('x_0', 'y_0', '\\theta_0', '\\alpha', '\\beta'),
  yVel: cornerFcns.yVelTeX('x_0', 'y_0', '\\theta_0', '\\alpha', '\\beta'),
};

export const makeUniformFlowFcns = (inputs) => {
  const { vp, stream, xVel, yVel } = uniformFcns;
  const { U, V } = inputs;
  return {
    vp: vp(U, V),
    stream: stream(U, V),
    xVel: xVel(U, V),
    yVel: yVel(U, V)
  };
};

export const uniformFlowStrs = (inputs) => {
  const { vpTeX, streamTeX, xVelTeX, yVelTeX } = uniformFcns;
  const { U, V } = inputs;
  return {
    vp: vpTeX(U, V),
    stream: streamTeX(U, V),
    xVel: xVelTeX(U, V),
    yVel: yVelTeX(U, V)
  };
};

export const makePointSourceFlowFcns = (inputs) => {
  const { vp, stream, xVel, yVel } = pointSourceFcns;
  const { m, x0, y0 } = inputs;
  return {
    vp: vp(m, x0, y0),
    stream: stream(m, x0, y0),
    xVel: xVel(m, x0, y0),
    yVel: yVel(m, x0, y0),
  };
};

export const pointSourceFlowStrs = (inputs) => {
  const { vpTeX, streamTeX, xVelTeX, yVelTeX } = pointSourceFcns;
  const { m, x0, y0 } = inputs;
  return {
    vp: vpTeX(m, x0, y0),
    stream: streamTeX(m, x0, y0),
    xVel: xVelTeX(m, x0, y0),
    yVel: yVelTeX(m, x0, y0),
  }
};

export const makePointVortexFlowFcns = (inputs) => {
  const { vp, stream, xVel, yVel } = pointVortexFcns;
  const { gamma, x0, y0 } = inputs;
  return {
    vp: vp(gamma, x0, y0),
    stream: stream(gamma, x0, y0),
    xVel: xVel(gamma, x0, y0),
    yVel: yVel(gamma, x0, y0),
  };
};

export const pointVortexFlowStrs = (inputs) => {
  const { vpTeX, streamTeX, xVelTeX, yVelTeX } = pointVortexFcns;
  const { gamma, x0, y0 } = inputs;
  return {
    vp: vpTeX(gamma, x0, y0),
    stream: streamTeX(gamma, x0, y0),
    xVel: xVelTeX(gamma, x0, y0),
    yVel: yVelTeX(gamma, x0, y0),
  };
};

export const makeDipoleFlowFcns = (inputs) => {
  const { vp, stream, xVel, yVel } = dipoleFcns;
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: vp(mu, x0, y0, alpha),
    stream: stream(mu, x0, y0, alpha),
    xVel: xVel(mu, x0, y0, alpha),
    yVel: yVel(mu, x0, y0, alpha),
  };
};

export const dipoleFlowStrs = (inputs) => {
  const { vpTeX, streamTeX, xVelTeX, yVelTeX } = dipoleFcns;
  const { mu, x0, y0, alpha } = inputs;
  return {
    vp: vpTeX(mu, x0, y0, alpha),
    stream: streamTeX(mu, x0, y0, alpha),
    xVel: xVelTeX(mu, x0, y0, alpha),
    yVel: yVelTeX(mu, x0, y0, alpha),
  };
};

export const makeCornerFlowFcns = (inputs) => {
  const { vp, stream, xVel, yVel } = cornerFcns;
  const { x0, y0, theta0, alpha, beta } = inputs;
  return {
    vp: vp(x0, y0, theta0, alpha, beta),
    stream: stream(x0, y0, theta0, alpha, beta),
    xVel: xVel(x0, y0, theta0, alpha, beta),
    yVel: yVel(x0, y0, theta0, alpha, beta),
  };
};

export const cornerFlowStrs = (inputs) => {
  const { vpTeX, streamTeX, xVelTeX, yVelTeX } = cornerFcns;
  const { x0, y0, theta0, alpha, beta } = inputs;
  return {
    vp: vpTeX(x0, y0, theta0, alpha, beta),
    stream: streamTeX(x0, y0, theta0, alpha, beta),
    xVel: xVelTeX(x0, y0, theta0, alpha, beta),
    yVel: yVelTeX(x0, y0, theta0, alpha, beta),
  };
};

const mapFlowsLongToShort = {
  [UNIFORM]: 'U',
  [POINT_SOURCE]: 'PS',
  [POINT_VORTEX]: 'PV',
  [DIPOLE]: 'D',
  [CORNER]: 'C',
};
const mapFlowsShortToLong = {
  'U': UNIFORM,
  'PS': POINT_SOURCE,
  'PV': POINT_VORTEX,
  'D': DIPOLE,
  'C': CORNER,
};
const mapGroupsLongToShort = {
  'Rankine Halfbody': 'RH',
  'Rankine Oval': 'RO',
  'Cylinder': 'C',
  'Rotating Cylinder': 'RC',
};
const mapGroupsShortToLong = {
  'RH': 'Rankine Halfbody',
  'RO': 'Rankine Oval',
  'C': 'Cylinder',
  'RC': 'Rotating Cylinder',
};

// encode helper function
function getFlowComponents(flow, parentId) {
  // flow type
  const components = [
    `i=${flow.flowId}`,
    `t=${mapFlowsLongToShort[flow.type]}`,
  ];
  if(parentId !== undefined) {
    components.push(`p=${parentId}`);
  }
  Object.keys(flow.inputs).forEach((key) => {
    components.push(`${key}=${flow.inputs[key]}`);
  });
  
  return components;
};

export const encodeSearchString = (flowIds, flowMap) => {
  const searchData = [];
  flowIds.forEach((id) => {
    const flow = flowMap[id];
    let components;
    if(flow.group) {
      flow.flowIds.forEach((subId) => {
        searchData.push(
          getFlowComponents(flowMap[subId], id).join('&')
        );
      });
      components = [
        `i=${flow.flowId}`,
        `n=${mapGroupsLongToShort[flow.name]}`, // name
        `c=${flow.flowIds.join('+')}`, // child IDs
      ];
    } else {
      components = getFlowComponents(flow);
    }
    searchData.push(components.join('&'));
  });
  
  return searchData.join(',');
};

function resolveId(id, index, usedIndexes) {
  let flowId = Number(id);
  if(Number.isNaN(flowId)) {
    while(usedIndexes.includes(index)) {
      index += 1;
    }
    flowId = index;
  } else {
    index = flowId;
  }
  return { flowId, index };
};

export const decodeSearchString = (str) => {
  const flowIds = [];
  const flowMap = {};
  const flowsStrs = str.split(',');
  const usedIndexes = [];
  let index = 0;
  let maxIndex = 0;
  
  flowsStrs.forEach((flowStr) => {
    const components = flowStr.split('&');
    const map = components.reduce((m, c) => {
      const pieces = c.split('=');
      if(pieces.length !== 2) return m;
      m[pieces[0]] = pieces[1];
      return m;
    }, {});
    const resolved = resolveId(map.i, index, usedIndexes);
    index = resolved.index;
    const flow = { flowId: resolved.flowId };
    usedIndexes.push(flow.flowId);
    let addToMain = true;
    
    if(map.c) {
      // flow group
      flow.group = true;
      flow.name = mapGroupsShortToLong[map.n];
      flow.flowIds = map.c.split('+').reduce((arr, subId) => {
        const subResolved = resolveId(subId);
        arr.push(subResolved.flowId);
        return arr;
      }, []);
      if(flow.flowIds.length === 0) {
        return;
      }
    } else if(map.t) {
      flow.type = mapFlowsShortToLong[map.t];
      if(map.p !== undefined) {
        addToMain = false;
        const parentResolved = resolveId(map.p);
        flow.parentId = parentResolved.flowId;
      }
      delete map.i;
      delete map.t;
      delete map.p;
      const inputs = Object.keys(map).reduce((newMap, key) => {
        newMap[key] = Number(map[key]) || 0;
        return newMap;
      }, {});
      flow.inputs = inputs;
      switch(flow.type) {
        case UNIFORM:
          flow.flowFcns = makeUniformFlowFcns(inputs);
          flow.flowStrs = uniformFlowStrs(inputs);
          break;
        case POINT_SOURCE:
          flow.flowFcns = makePointSourceFlowFcns(inputs);
          flow.flowStrs = pointSourceFlowStrs(inputs);
          break;
        case POINT_VORTEX:
          flow.flowFcns = makePointVortexFlowFcns(inputs);
          flow.flowStrs = pointVortexFlowStrs(inputs);
          break;
        case DIPOLE:
          flow.flowFcns = makeDipoleFlowFcns(inputs);
          flow.flowStrs = dipoleFlowStrs(inputs);
          break;
        case CORNER:
          flow.flowFcns = makeCornerFlowFcns(inputs);
          flow.flowStrs = cornerFlowStrs(inputs);
      }
    } else {
      return;
    }
    flowMap[flow.flowId] = flow;
    if(addToMain) {
      flowIds.push(flow.flowId);
    }

    maxIndex = Math.max(flow.flowId, maxIndex);
  });

  return { flowIds, flowMap, maxIndex };
};