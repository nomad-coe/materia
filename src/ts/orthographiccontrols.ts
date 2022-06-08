import * as THREE from 'three'

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 * @author Simone Manini / http://daron1337.github.io
 * @author Luca Antiga 	/ http://lantiga.github.io
 * @author Lauri Himanen
 */


const changeEvent = new CustomEvent('change');
const startEvent = new CustomEvent('start');
const endEvent = new CustomEvent('end');
const STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };
const EPS = 0.0001;

export class OrthographicControls {
    enabled: boolean;
    enablePan: boolean;
    enableZoom: boolean;
    enableRotate: boolean;
    resetOnDoubleClick: boolean;
    staticMoving: boolean;

    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    dynamicDampingFactor: number;

    rotationCenter: any;
    target: any;
    object: any;
    minDistance: number;
    maxDistance: number;

    domElement: any;
    keys: any;
    screen: any;
    target0: any;
    rotationCenter0: any;
    position0: any;
    up0: any;
    zoom0: number;

    this: any;
    _state = STATE.NONE;
    _prevState: any;
    _eye: any;
    _movePrev: any;
    _moveCurr: any;
    _lastAxis: any;
    _lastAngle: any;
    _zoomStart: any;
    _zoomEnd: any;
    _zoomed: boolean;
    _touchZoomDistanceStart: any;
    _touchZoomDistanceEnd: any;
    _lastPosition: any;
    _listeners: any;
    _panEnd: any;
    _panStart: any;

    constructor(object, domElement) {
        this.object = object;
        this.domElement = ( domElement !== undefined ) ? domElement : document;

        // Public
        this.enabled = true;
        this.screen = { left: 0, top: 0, width: 0, height: 0 };
        this.rotateSpeed = 1.0;
        this.zoomSpeed = 0.2;
        this.panSpeed = 0.3;
        this.enableRotate = true;
        this.enableZoom = true;
        this.enablePan = true;
        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // Private
        this.rotationCenter = new THREE.Vector3();
        this.target = new THREE.Vector3();
        this._prevState = STATE.NONE,
        this._eye = new THREE.Vector3(),
        this._movePrev = new THREE.Vector2(),
        this._moveCurr = new THREE.Vector2(),
        this._lastAxis = new THREE.Vector3(),
        this._lastAngle = 0,
        this._lastPosition = new THREE.Vector3();
        this._zoomStart = new THREE.Vector2(),
        this._zoomEnd = new THREE.Vector2(),
        this._touchZoomDistanceStart = 0,
        this._touchZoomDistanceEnd = 0,
        this._panStart = new THREE.Vector2(),
        this._panEnd = new THREE.Vector2();
        this._zoomed = false;

        // For reset
        this.rotationCenter0 = this.rotationCenter.clone();
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();
        this.zoom0 = this.object.zoom;

        this.domElement.addEventListener( 'contextmenu', this.contextmenu.bind(this), false );
        this.domElement.addEventListener( 'mousedown', this.mousedown.bind(this), false );
        this.domElement.addEventListener( 'mousewheel', this.mousewheel.bind(this), false );
        this.domElement.addEventListener( 'MozMousePixelScroll', this.mousewheel.bind(this), false ); // firefox

        this.domElement.addEventListener( 'touchstart', this.touchstart.bind(this), false );
        this.domElement.addEventListener( 'touchend', this.touchend.bind(this), false );
        this.domElement.addEventListener( 'touchmove', this.touchmove.bind(this), false );

        this.domElement.addEventListener( 'mousemove', this.mousemove.bind(this), false );
        this.domElement.addEventListener( 'mouseup', this.mouseup.bind(this), false );

        this.domElement.addEventListener( 'dblclick', this.dblclick.bind(this), false );

        this.handleResize();

        // force an update at start
        this.update();
    }

	handleResize() {
		if ( this.domElement === document ) {
			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;
		} else {
			const box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			const d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;
		}
	}

	handleEvent(event) {
		if ( typeof this[ event.type ] == 'function' ) {
			this[ event.type ]( event );
		}
	}

    getMouseOnScreen(pageX, pageY) {
		const vector = new THREE.Vector2();
        vector.set(
            ( pageX - this.screen.left ) / this.screen.width,
            ( pageY - this.screen.top ) / this.screen.width
        );
        return vector;
	}

	getMouseOnCircle(pageX, pageY) {
		const vector = new THREE.Vector2();
        vector.set(
            ( ( pageX - this.screen.width * 0.5 - this.screen.left ) / ( this.screen.width * 0.5 ) ),
            ( ( this.screen.height + 2 * ( this.screen.top - pageY ) ) / this.screen.width ) // screen.width intentional
        );
        return vector;
	}

    /**
      * Used to trigger rotation after a move has been detected and stored in
      * this.movePrev and this.moveCurr.
      */
	rotateCamera() {
		const axis = new THREE.Vector3()
		const quaternion = new THREE.Quaternion()
		const eyeDirection = new THREE.Vector3()
		const objectUpDirection = new THREE.Vector3()
		const objectSidewaysDirection = new THREE.Vector3()
		const moveDirection = new THREE.Vector3()

        moveDirection.set(this._moveCurr.x - this._movePrev.x, this._moveCurr.y - this._movePrev.y, 0 )
        let angle = moveDirection.length()
        if (angle) {
            this._eye.copy( this.object.position ).sub( this.rotationCenter )

            eyeDirection.copy( this._eye ).normalize()
            objectUpDirection.copy( this.object.up ).normalize()
            objectSidewaysDirection.crossVectors( objectUpDirection, eyeDirection ).normalize()

            objectUpDirection.setLength( this._moveCurr.y - this._movePrev.y )
            objectSidewaysDirection.setLength( this._moveCurr.x - this._movePrev.x )

            moveDirection.copy( objectUpDirection.add( objectSidewaysDirection ) )

            axis.crossVectors( moveDirection, this._eye ).normalize()

            const zoomFactor = this.object.zoom
            angle *= this.rotateSpeed
            angle /= zoomFactor
            quaternion.setFromAxisAngle( axis, angle )

            this._eye.applyQuaternion( quaternion )
            this.object.up.applyQuaternion( quaternion )

            this._lastAxis.copy( axis )
            this._lastAngle = angle

        } else if ( ! this.staticMoving && this._lastAngle ) {
            this._lastAngle *= Math.sqrt( 1.0 - this.dynamicDampingFactor )
            this._eye.copy( this.object.position ).sub( this.rotationCenter )
            quaternion.setFromAxisAngle( this._lastAxis, this._lastAngle )
            this._eye.applyQuaternion( quaternion )
            this.object.up.applyQuaternion( quaternion )
        }
        this._movePrev.copy( this._moveCurr )
	}


	zoomCamera() {
		let factor;
		if ( this._state === STATE.TOUCH_ZOOM_PAN ) {

			factor = this._touchZoomDistanceStart / this._touchZoomDistanceEnd;
			this._touchZoomDistanceStart = this._touchZoomDistanceEnd;
            this.object.zoom /= factor;
            this.object.updateProjectionMatrix();
            this._zoomed = true;

		} else {

			factor = 1.0 + ( this._zoomEnd.y - this._zoomStart.y );

			if ( factor !== 1.0 && factor > 0.0 ) {

				this.object.zoom /= factor;
                this.object.updateProjectionMatrix();
                this._zoomed = true;

				if ( this.staticMoving ) {
					this._zoomStart.copy( this._zoomEnd );
				} else {
					this._zoomStart.y += ( this._zoomEnd.y - this._zoomStart.y ) * this.dynamicDampingFactor;
				}
			}
		}
	}

	panCamera() {
		const mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

        mouseChange.copy( this._panEnd ).sub( this._panStart );

        if ( mouseChange.lengthSq() ) {
            const zoomFactor = this.object.zoom;
            mouseChange.multiplyScalar( this.panSpeed / zoomFactor );

            pan.copy( this._eye ).cross( this.object.up ).setLength( mouseChange.x );
            pan.add( objectUp.copy( this.object.up ).setLength( mouseChange.y ) );

            this.object.position.add( pan );
            this.rotationCenter.add( pan );
            if ( this.staticMoving ) {
                this._panStart.copy( this._panEnd );
            } else {
                this._panStart.add( mouseChange.subVectors( this._panEnd, this._panStart ).multiplyScalar( this.dynamicDampingFactor ) );
            }
		}
	}

	checkDistances() {
		if ( this.enableZoom || this.enablePan ) {
			if ( this._eye.lengthSq() > this.maxDistance * this.maxDistance ) {
				this.object.position.addVectors( this.rotationCenter, this._eye.setLength( this.maxDistance ) );
				this._zoomStart.copy( this._zoomEnd );
			}
			if ( this._eye.lengthSq() < this.minDistance * this.minDistance ) {
				this.object.position.addVectors( this.rotationCenter, this._eye.setLength( this.minDistance ) );
				this._zoomStart.copy( this._zoomEnd );
			}
		}
	}

    /**
      * Used to update the controlled object after the user has manipulated the
      * scene. Will also request a new render if the manipulation has changed
      * the scene.
      */
	update() {
		this._eye.subVectors( this.object.position, this.rotationCenter );

		if ( this.enableRotate ) {
			this.rotateCamera();
		}
		if ( this.enableZoom ) {
			this.zoomCamera();
		}
		if ( this.enablePan ) {
			this.panCamera();
		}

		this.object.position.addVectors( this.rotationCenter, this._eye );
		this.checkDistances();
		this.object.lookAt( this.rotationCenter );

        const delta = this._lastPosition.distanceToSquared( this.object.position );
		if ( delta > EPS || this._zoomed) {
			this.dispatchEvent(changeEvent);
			this._lastPosition.copy( this.object.position );
			this._zoomed = false;
		}
	}

    /**
     * Saves the current configuration as the reset configuration.
     */
	saveReset() : void {
		this.rotationCenter0.copy( this.rotationCenter );
		this.position0.copy( this.object.position );
		this.up0.copy( this.object.up );
		this.zoom0 = this.object.zoom;
	}

    /**
     * Loads the last saved reset state.
     */
	reset() : void {
		this._state = STATE.NONE;
		this._prevState = STATE.NONE;
		this.rotationCenter.copy( this.rotationCenter0 );
		this.object.position.copy( this.position0 );
		this.object.up.copy( this.up0 );
		this._eye.subVectors( this.object.position, this.rotationCenter );
		this.object.lookAt( this.rotationCenter );
		this.object.zoom = this.zoom0;
        this.object.updateProjectionMatrix();
		this._lastPosition.copy(this.object.position);
	}

	dispose() {
		this.domElement.removeEventListener( 'contextmenu', this.contextmenu.bind(this), false );
		this.domElement.removeEventListener( 'mousedown', this.mousedown.bind(this), false );
		this.domElement.removeEventListener( 'mousewheel', this.mousewheel.bind(this), false );
		this.domElement.removeEventListener( 'MozMousePixelScroll', this.mousewheel.bind(this), false ); // firefox
		this.domElement.removeEventListener( 'touchstart', this.touchstart.bind(this), false );
		this.domElement.removeEventListener( 'touchend', this.touchend.bind(this), false );
		this.domElement.removeEventListener( 'touchmove', this.touchmove.bind(this), false );
		this.domElement.removeEventListener( 'mousemove', this.mousemove.bind(this), false );
		this.domElement.removeEventListener( 'mouseup', this.mouseup.bind(this), false );
		this.domElement.removeEventListener( 'dblclick', this.dblclick.bind(this), false );
	}

    mousedown( event ) {
        if ( this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        if ( this._state === STATE.NONE ) {
            this._state = event.button;
        }

        if ( this._state === STATE.ROTATE && this.enableRotate ) {

            this._moveCurr.copy( this.getMouseOnCircle( event.pageX, event.pageY ) );
            this._movePrev.copy( this._moveCurr );

        } else if ( this._state === STATE.ZOOM && this.enableZoom ) {

            this._zoomStart.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );
            this._zoomEnd.copy( this._zoomStart );

        } else if ( this._state === STATE.PAN && this.enablePan ) {

            this._panStart.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );
            this._panEnd.copy( this._panStart );

        }

        this.dispatchEvent( startEvent );

    }

    mousemove(event) {
        if ( this.enabled === false ) return;
        if ( this._state !== STATE.NONE) {
            event.preventDefault();
            event.stopPropagation();
        }
        if ( this._state === STATE.ROTATE && this.enableRotate ) {
            this._movePrev.copy( this._moveCurr );
            this._moveCurr.copy( this.getMouseOnCircle(event.pageX, event.pageY) );
        } else if ( this._state === STATE.ZOOM && this.enableZoom ) {
            this._zoomEnd.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );
        } else if ( this._state === STATE.PAN && this.enablePan ) {
            this._panEnd.copy( this.getMouseOnScreen( event.pageX, event.pageY ) );
        }

        // Trigger update after moving mouse
        this.update();
    }

    mouseup( event ) {
        if ( this.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();
        this._state = STATE.NONE;
        document.removeEventListener( 'mousemove', this.mousemove.bind(this) );
        document.removeEventListener( 'mouseup', this.mouseup.bind(this) );
        this.dispatchEvent( endEvent );
    }

    dblclick( event ) {
        if ( this.enabled === false || !this.resetOnDoubleClick) return
        event.preventDefault()
        event.stopPropagation()
        this.reset()
        this.dispatchEvent(changeEvent);
    }

    mousewheel( event ) {
        if ( this.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();

        let delta = 0;
        // WebKit / Opera / Explorer 9
        if ( event.wheelDelta ) {
            delta = event.wheelDelta;
        // Firefox
        } else if ( event.detail ) {
            delta = - event.detail;
        }

        // Normalization due to inconsistent scroll speeds across browsers.
        delta /= Math.abs(delta)

        this._zoomStart.y += delta * this.zoomSpeed;
        this.dispatchEvent( startEvent );
        this.dispatchEvent( endEvent );

        // Trigger update after wheel scroll
        this.update();
    }

    touchstart( event ) {
        if ( this.enabled === false ) return;
        switch ( event.touches.length ) {
            case 1:
                this._state = STATE.TOUCH_ROTATE;
                this._moveCurr.copy( this.getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                this._movePrev.copy( this._moveCurr );
                break;
            default: // 2 or more
                this._state = STATE.TOUCH_ZOOM_PAN;
                const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                this._touchZoomDistanceEnd = this._touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );

                const x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                const y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                this._panStart.copy( this.getMouseOnScreen( x, y ) );
                this._panEnd.copy( this._panStart );
                break;

        }

        this.dispatchEvent( startEvent );

    }

    touchmove( event ) {
        if ( this.enabled === false ) return;

        event.preventDefault();
        event.stopPropagation();

        switch ( event.touches.length ) {

            case 1:
                this._movePrev.copy( this._moveCurr );
                this._moveCurr.copy( this.getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                break;

            default: // 2 or more
                const dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                const dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                this._touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy );

                const x = ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX ) / 2;
                const y = ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY ) / 2;
                this._panEnd.copy( this.getMouseOnScreen( x, y ) );
                break;
        }

        // Trigger update after touch move
        this.update()
    }

    touchend( event ) {
        if ( this.enabled === false ) return;
        switch ( event.touches.length ) {
            case 0:
                this._state = STATE.NONE;
                break;

            case 1:
                this._state = STATE.TOUCH_ROTATE;
                this._moveCurr.copy( this.getMouseOnCircle( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY ) );
                this._movePrev.copy( this._moveCurr );
                break;
        }
        this.dispatchEvent( endEvent );
    }

    contextmenu( event ) {
        event.preventDefault();
    }

	addEventListener( type, listener ) {
		if ( this._listeners === undefined ) this._listeners = {};
		const listeners = this._listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}
		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	}

	hasEventListener( type, listener ) {
		if ( this._listeners === undefined ) return false;
		const listeners = this._listeners;
		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
	}

	removeEventListener( type, listener ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			const index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	}

	dispatchEvent( event ) {
		if ( this._listeners === undefined ) return;
		const listeners = this._listeners;
		const listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
		}
	}
}
