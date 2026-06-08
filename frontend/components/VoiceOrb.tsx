'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function VoiceOrb({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let W = rect.width || 600
    let H = rect.height || 600

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.01, 100)
    camera.position.z = 2.9

    // ── Brand palette ──────────────────────────────────────────────────────
    const cMagenta = new THREE.Color('#E879F9')
    const cCyan    = new THREE.Color('#22D3EE')
    const cBlue    = new THREE.Color('#2563EB')

    // ── 1. Main voice sphere — Fibonacci point cloud ───────────────────────
    const N = 6000
    const sphereGeo = new THREE.BufferGeometry()
    const pos     = new Float32Array(N * 3)
    const origPos = new Float32Array(N * 3)
    const col     = new Float32Array(N * 3)

    for (let i = 0; i < N; i++) {
      // Fibonacci sphere: perfectly uniform coverage
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.sin(phi) * Math.sin(theta)
      const z = Math.cos(phi)

      origPos[i * 3]     = x
      origPos[i * 3 + 1] = y
      origPos[i * 3 + 2] = z
      pos[i * 3]     = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // Gradient: top = magenta, equator = cyan, bottom = blue
      const t = (y + 1) / 2
      const c = t > 0.5
        ? cCyan.clone().lerp(cMagenta, (t - 0.5) * 2)
        : cBlue.clone().lerp(cCyan, t * 2)
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    sphereGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    sphereGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3))

    const sphereMat = new THREE.PointsMaterial({
      size: 0.016,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const sphere = new THREE.Points(sphereGeo, sphereMat)
    scene.add(sphere)

    // ── 2. Wireframe ghost sphere ──────────────────────────────────────────
    const wireGeo = new THREE.IcosahedronGeometry(1.01, 4)
    const wireMat = new THREE.MeshBasicMaterial({
      color: '#22D3EE',
      wireframe: true,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const wireSphere = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wireSphere)

    // ── 3. Emanating signal rings ──────────────────────────────────────────
    const ringDefs = [
      { color: '#E879F9', rx: Math.PI / 2,      rz:  0.2,  speed: 0.32, offset: 0.0 },
      { color: '#22D3EE', rx: Math.PI / 3,      rz: -0.45, speed: 0.44, offset: 0.8 },
      { color: '#E879F9', rx: Math.PI / 4,      rz:  0.75, speed: 0.28, offset: 1.5 },
      { color: '#2563EB', rx: Math.PI * 0.62,   rz: -0.3,  speed: 0.52, offset: 0.35 },
      { color: '#22D3EE', rx: Math.PI * 0.38,   rz:  1.1,  speed: 0.38, offset: 2.1 },
    ]

    const rings: Array<{
      mesh: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>
      speed: number
      offset: number
    }> = []

    ringDefs.forEach(def => {
      const rGeo = new THREE.TorusGeometry(1.0, 0.004, 6, 96)
      const rMat = new THREE.MeshBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(rGeo, rMat)
      ring.rotation.x = def.rx
      ring.rotation.z = def.rz
      scene.add(ring)
      rings.push({ mesh: ring, speed: def.speed, offset: def.offset })
    })

    // ── 4. Inner core (dual-layer glow) ────────────────────────────────────
    const coreGeo  = new THREE.SphereGeometry(0.28, 32, 32)
    const coreMat  = new THREE.MeshBasicMaterial({
      color: '#E879F9', transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    const core2Geo = new THREE.SphereGeometry(0.14, 32, 32)
    const core2Mat = new THREE.MeshBasicMaterial({
      color: '#22D3EE', transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const core2 = new THREE.Mesh(core2Geo, core2Mat)
    scene.add(core2)

    // ── 5. Ambient floating particles ─────────────────────────────────────
    const N_AMB = 500
    const ambGeo    = new THREE.BufferGeometry()
    const ambPos    = new Float32Array(N_AMB * 3)
    const ambColors = new Float32Array(N_AMB * 3)

    for (let i = 0; i < N_AMB; i++) {
      const r     = 1.6 + Math.random() * 2.2
      const t2    = Math.random() * Math.PI * 2
      const p2    = Math.acos(2 * Math.random() - 1)
      ambPos[i * 3]     = r * Math.sin(p2) * Math.cos(t2)
      ambPos[i * 3 + 1] = r * Math.sin(p2) * Math.sin(t2)
      ambPos[i * 3 + 2] = r * Math.cos(p2)

      const c = Math.random() > 0.5 ? cCyan : cMagenta
      const br = 0.25 + Math.random() * 0.35
      ambColors[i * 3]     = c.r * br
      ambColors[i * 3 + 1] = c.g * br
      ambColors[i * 3 + 2] = c.b * br
    }

    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3))
    ambGeo.setAttribute('color',    new THREE.BufferAttribute(ambColors, 3))

    const ambMat = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ambParticles = new THREE.Points(ambGeo, ambMat)
    scene.add(ambParticles)

    // ── Mouse interaction ──────────────────────────────────────────────────
    let targetRY = 0, targetRX = 0
    let smoothRY = 0, smoothRX = 0

    const onMouseMove = (e: MouseEvent) => {
      targetRY = ((e.clientX / window.innerWidth)  - 0.5) * 0.55
      targetRX = ((e.clientY / window.innerHeight) - 0.5) * 0.35
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation ──────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    let animId: number

    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse follow
      smoothRY += (targetRY - smoothRY) * 0.04
      smoothRX += (targetRX - smoothRX) * 0.04

      // Sphere rotation (auto + mouse offset)
      sphere.rotation.y = t * 0.075 + smoothRY
      sphere.rotation.x = Math.sin(t * 0.042) * 0.13 + smoothRX
      wireSphere.rotation.y = t * 0.055 + smoothRY * 0.8
      wireSphere.rotation.x = Math.sin(t * 0.035) * 0.09 + smoothRX * 0.8

      // Voice-wave vertex displacement — multi-harmonic
      const posAttr = sphereGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < N; i++) {
        const ox = origPos[i * 3]
        const oy = origPos[i * 3 + 1]
        const oz = origPos[i * 3 + 2]

        const phi2  = Math.atan2(Math.sqrt(ox * ox + oz * oz), oy)
        const theta2 = Math.atan2(oz, ox)

        // Layered harmonics: fundamental + overtones (simulates vocal formants)
        const d =
          0.058 * Math.sin(3 * phi2 + t * 2.15) * Math.cos(2 * theta2 + t * 1.75) +
          0.036 * Math.sin(5 * phi2 + t * 3.25) * Math.cos(4 * theta2 - t * 2.35) +
          0.022 * Math.sin(7 * phi2 - t * 1.65) * Math.cos(6 * theta2 + t * 3.45) +
          0.014 * Math.sin(11 * phi2 + t * 4.1) * Math.cos(3 * theta2 - t * 1.9) +
          0.008 * Math.sin(t * 5.2 + phi2 * 4) // global breathe

        const r = 1 + d
        posAttr.setXYZ(i, ox * r, oy * r, oz * r)
      }
      posAttr.needsUpdate = true

      // Rings: scale out and fade like radio pulses
      rings.forEach(({ mesh, speed, offset }) => {
        const progress = ((t * speed + offset) % 2.8) / 2.8
        mesh.scale.setScalar(1 + progress * 1.9)
        mesh.material.opacity = 0.52 * Math.pow(1 - progress, 2)
      })

      // Core breathe
      const breathe = 1 + 0.22 * Math.sin(t * 3.1)
      core.scale.setScalar(breathe)
      coreMat.opacity = 0.11 + 0.09 * Math.sin(t * 2.7)
      core2.scale.setScalar(1 + 0.28 * Math.sin(t * 3.9 + 1.1))
      core2Mat.opacity = 0.28 + 0.18 * Math.sin(t * 3.5)

      // Ambient drift
      ambParticles.rotation.y = t * 0.022
      ambParticles.rotation.z = t * 0.014

      renderer.render(scene, camera)
    }

    animate()

    // ── Resize ─────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) return
      W = r.width
      H = r.height
      renderer.setSize(W, H, false)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      sphereGeo.dispose(); sphereMat.dispose()
      wireGeo.dispose();   wireMat.dispose()
      coreGeo.dispose();   coreMat.dispose()
      core2Geo.dispose();  core2Mat.dispose()
      ambGeo.dispose();    ambMat.dispose()
      rings.forEach(r => { r.mesh.geometry.dispose(); r.mesh.material.dispose() })
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
