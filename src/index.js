import Matter from 'matter-js'
import { degrees, radians } from 'radians'
import random from 'random'
import * as PIXI from 'pixi.js'
import { width, height } from './config'
import './style.scss'


window.start = () => {

	// PIXI js
	let app = new PIXI.Application({
		width: width, height: height
	})
	document.body.appendChild(app.view)
	app.view.id = 'pixijs'

	// Matter js
  let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  World = Matter.World,
	Constraint = Matter.Constraint,
	Composite = Matter.Composite,
  Bodies = Matter.Bodies,
	Body = Matter.Body,
	Events = Matter.Events;

	// create engine
	let engine = Engine.create()
	let world = engine.world
	let runner = Runner.create()
	let renderer = Render.create({
		element: document.body,
		engine: engine,
		options: {
			width: width,
			height: height,
			pixelRatio: 1,
			enabled: true,
			wireframes: true,
			showVelocity: false,
			showAngleIndicator: false,
			showCollisions: true
		}
	})
	renderer.canvas.id = 'matterjs'
	// renderer.canvas.style.opacity = .5
	// run physics
	Render.run(renderer)
	Runner.run(runner, engine)

	Events.on(engine, 'beforeTick', e => {

	})

	let ground = Bodies.rectangle(width/2, height + 50, width, 200, { isStatic: true })
	// create ragdoll guy
	function createRagdoll(scale) {
		let lowerLeg1 = Bodies.rectangle(0, 100*scale, 10*scale, 30*scale)
		let lowerLeg2 = Bodies.rectangle(20*scale, 100*scale, 10*scale, 30*scale)
		let upperLeg1 = Bodies.rectangle(0, 50*scale, 10*scale, 30*scale)
		let upperLeg2 = Bodies.rectangle(20*scale, 50*scale, 10*scale, 30*scale)
		let torso = Bodies.rectangle(10*scale, 0*scale, 25*scale, 50*scale)
		let head = Bodies.rectangle(10*scale, 0*scale, 25*scale, 25*scale)
		let upperArm1 = Bodies.rectangle(-10*scale, 20*scale, 10*scale, 20*scale)
		let lowerArm1 = Bodies.rectangle(-10*scale, 50*scale, 10*scale, 20*scale)
		let upperArm2 = Bodies.rectangle(40*scale, 20*scale, 10*scale, 20*scale)
		let lowerArm2 = Bodies.rectangle(40*scale, 50*scale, 10*scale, 20*scale)
		lowerLeg1.label = 'lower leg 1'
		upperLeg1.label = 'upper leg 1'
		lowerLeg2.label = 'lower leg 2'
		upperLeg2.label = 'upper leg 2'
		upperArm1.label = 'upper arm 1'
		lowerArm1.label = 'lower arm 1'
		upperArm2.label = 'upper arm 2'
		lowerArm2.label = 'lower arm 2'
		head.label = 'head'
		torso.label = 'torso'

		let renderProps = {
			anchors: false,
			visible: false
		}

		let upperleg1_to_torso = Constraint.create({
			bodyA: upperLeg1,
			bodyB: torso,
			pointA: { x: 0*scale, y: -15*scale },
			pointB: { x: -10*scale, y: 25*scale },
			length: 1*scale,
			render: renderProps
		})
		let upperleg2_to_torso = Constraint.create({
			bodyA: upperLeg2,
			bodyB: torso,
			pointA: { x: 0*scale, y: -15*scale },
			pointB: { x: 10*scale, y: 25*scale },
			length: 1*scale,
			render: renderProps
		})
		let lowerleg1_to_upperleg1 = Constraint.create({
			bodyA: lowerLeg1,
			bodyB: upperLeg1,
			pointA: { x: 0*scale, y: -15*scale },
			pointB: { x: 0*scale, y: 15*scale },
			length: 1*scale,
			render: renderProps
		})
		let lowerleg2_to_upperleg2 = Constraint.create({
			bodyA: lowerLeg2,
			bodyB: upperLeg2,
			pointA: { x: 0*scale, y: -15*scale },
			pointB: { x: 0*scale, y: 15*scale },
			length: 1*scale,
			render: renderProps
		})
		let head_to_torso = Constraint.create({
			bodyA: head,
			bodyB: torso,
			pointA: { x: 0*scale, y: 15*scale },
			pointB: { x: 0*scale, y: -25*scale },
			length: 4*scale,
			render: renderProps
		})
		let upperarm1_to_torso = Constraint.create({
			bodyA: upperArm1,
			bodyB: torso,
			pointA: { x: 0*scale, y: -10*scale },
			pointB: { x: -15*scale, y: -25*scale },
			length: 4*scale,
			render: renderProps
		})
		let lowerarm1_to_upperarm1 = Constraint.create({
			bodyA: upperArm1,
			bodyB: lowerArm1,
			pointA: { x: 0*scale, y: 10*scale },
			pointB: { x: 0*scale, y: -10*scale },
			length: 1*scale,
			render: renderProps
		})
		let upperarm2_to_torso = Constraint.create({
			bodyA: upperArm2,
			bodyB: torso,
			pointA: { x: 0*scale, y: -10*scale },
			pointB: { x: 15*scale, y: -25*scale },
			length: 4*scale,
			render: renderProps
		})
		let lowerarm2_to_upperarm2 = Constraint.create({
			bodyA: upperArm2,
			bodyB: lowerArm2,
			pointA: { x: 0*scale, y: 10*scale },
			pointB: { x: 0*scale, y: -10*scale },
			length: 1*scale,
			render: renderProps
		})

		let collection = Composite.create({
		})
		Composite.add(collection, [
			head, torso,
			lowerLeg1, lowerLeg2,
			upperLeg1, upperLeg2,
			upperArm1, lowerArm1,
			upperArm2, lowerArm2,
			upperleg1_to_torso, upperleg2_to_torso,
			lowerleg1_to_upperleg1, lowerleg2_to_upperleg2,
			head_to_torso,
			upperarm1_to_torso, lowerarm1_to_upperarm1,
			upperarm2_to_torso, lowerarm2_to_upperarm2,

		])

		return collection
	}

	let rag1 = createRagdoll(.5)
	let rag2 = createRagdoll(1)
	// add bodies
	World.add(world, [
		ground,
		rag1, rag2
	])
	// can only translate AFTER bodies are added to the world
	Composite.translate(rag1, { x: 200, y: 0 })
	Composite.translate(rag2, { x: 400, y: 0 })

	document.addEventListener('click', e => {
		// Composite.applyForce(rag1.bodies[0], { x: rag1.position.x, y: rag1.position.y })
		// console.log(rag1.bodies)
		rag1.bodies[1].force = { x: 0, y: .2 }
		rag2.bodies[1].force = { x: 0, y: .75 }

		// console.log(
		// 	rag1.bodies[0]
		// );

	})

	// fit the render viewport to the scene
	Render.lookAt(renderer, {
		min: { x: 0, y: 0 },
		max: { x: width, y: height }
	})

	function render() { // custom render()
	}
	// render()

  // context for MatterTools.Demo
  return {
    engine: engine,
    runner: runner,
    render: renderer,
    canvas: renderer.canvas,
    stop: () => {
      Matter.Render.stop(renderer)
      Matter.Runner.stop(runner)
    }
  }

}
