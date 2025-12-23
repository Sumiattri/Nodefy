"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  ReactFlowProvider,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom nodes for React Flow
const Card3D = () => (
  <div className="bg-[#d8dce6] rounded-2xl p-4 w-[200px] shadow-lg cursor-grab active:cursor-grabbing">
    <div className="flex justify-between mb-2">
      <span className="text-[10px] text-[#555] uppercase tracking-wide font-medium">
        3D
      </span>
      <span className="text-[10px] text-[#888]">RODIN 2.0</span>
    </div>
    <div className="h-[240px] rounded-xl overflow-hidden bg-[#e8e5e0]">
      <Image
        src="/images/681cd65ba87c69df161752e5_3d_card.avif"
        alt="3D"
        width={180}
        height={230}
        className="object-contain w-full h-full"
        draggable={false}
      />
    </div>
    <Handle
      type="source"
      position={Position.Right}
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
  </div>
);

const ColorRefCard = () => (
  <div className="rounded-2xl p-4 w-[200px] shadow-lg bg-[#4a7aa8] cursor-grab active:cursor-grabbing">
    <div className="mb-2">
      <span className="text-[10px] text-white uppercase tracking-wide font-medium">
        Color Reference
      </span>
    </div>
    <div className="h-[120px] rounded-xl overflow-hidden">
      <Image
        src="/images/68349defe03a701656079aac_Color-diff_hero_mobile.avif"
        alt="Color"
        width={180}
        height={110}
        className="object-contain w-full h-full"
        draggable={false}
      />
    </div>
    <Handle
      type="source"
      position={Position.Right}
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
  </div>
);

const StableDiffusionCard = () => (
  <div className="bg-[#e8e4dc] rounded-2xl p-4 w-[340px] shadow-lg cursor-grab active:cursor-grabbing">
    <div className="flex justify-between mb-2">
      <span className="text-[10px] text-[#555] uppercase tracking-wide font-medium">
        Image
      </span>
      <span className="text-[10px] text-[#888]">STABLE DIFFUSION</span>
    </div>
    <div className="h-[480px] rounded-xl overflow-hidden">
      <Image
        src="/images/681cd7cbc22419b32bb9d8d8_hcard - STABLE DIFFUSION.avif"
        alt="Stable Diffusion"
        width={320}
        height={470}
        className="object-contain w-full h-full"
        draggable={false}
      />
    </div>
    <Handle
      type="target"
      position={Position.Left}
      id="left-top"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[30%]"
    />
    <Handle
      type="target"
      position={Position.Left}
      id="left-bottom"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[70%]"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right-top"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[30%]"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right-bottom"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[70%]"
    />
  </div>
);

const TextCard = () => (
  <div className="bg-white rounded-2xl p-5 w-[190px] shadow-lg border border-[#e8e8e0] cursor-grab active:cursor-grabbing">
    <div className="mb-3">
      <span className="text-[10px] text-[#555] uppercase tracking-wide font-medium">
        Text
      </span>
    </div>
    <p className="text-[10px] text-[#444] leading-relaxed">
      A Great-Tailed Grackle bird is flying from the background and settling on
      the model&apos;s shoulder slowly and barely moves. The model looks at the
      camera, then bird flies away. cinematic.
    </p>
    <Handle
      type="target"
      position={Position.Left}
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
  </div>
);

const FluxCard = () => (
  <div className="bg-[#f0ede4] rounded-2xl p-4 w-[220px] shadow-lg border border-[#e8e5dc] cursor-grab active:cursor-grabbing">
    <div className="flex justify-between mb-2">
      <span className="text-[10px] text-[#555] uppercase tracking-wide font-medium">
        Image
      </span>
      <span className="text-[10px] text-[#888]">FLUX PRO 1.1</span>
    </div>
    <div className="h-[200px] rounded-xl overflow-hidden">
      <Image
        src="/images/6837510acbe777269734b387_bird_desktop.avif"
        alt="Flux Pro Bird"
        width={200}
        height={190}
        className="object-cover w-full h-full"
        draggable={false}
      />
    </div>
    <Handle
      type="target"
      position={Position.Top}
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
    <Handle
      type="source"
      position={Position.Right}
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white"
    />
  </div>
);

const VideoCard = () => (
  <div className="bg-[#f5f0e8] rounded-2xl p-4 w-[340px] shadow-lg cursor-grab active:cursor-grabbing">
    <div className="flex justify-between mb-2">
      <span className="text-[10px] text-[#555] uppercase tracking-wide font-medium">
        Video
      </span>
      <span className="text-[10px] text-[#888]">MINIMAX VIDEO</span>
    </div>
    <div className="h-[480px] rounded-xl overflow-hidden">
      <Image
        src="/images/Screenshot 2025-12-21 at 18.22.57.png"
        alt="Minimax Video"
        width={320}
        height={470}
        className="object-contain w-full h-full"
        draggable={false}
      />
    </div>
    <Handle
      type="target"
      position={Position.Left}
      id="left-top"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[30%]"
    />
    <Handle
      type="target"
      position={Position.Left}
      id="left-bottom"
      className="!bg-[#aaa] !w-3 !h-3 !border-2 !border-white !top-[70%]"
    />
  </div>
);

const nodeTypes = {
  card3d: Card3D,
  colorRef: ColorRefCard,
  stableDiffusion: StableDiffusionCard,
  textCard: TextCard,
  fluxCard: FluxCard,
  videoCard: VideoCard,
};

const initialNodes: Node[] = [
  { id: "3d", type: "card3d", position: { x: 60, y: 360 }, data: {} },
  { id: "color", type: "colorRef", position: { x: 60, y: 660 }, data: {} },
  {
    id: "stable",
    type: "stableDiffusion",
    position: { x: 320, y: 330 },
    data: {},
  },
  { id: "text", type: "textCard", position: { x: 720, y: 360 }, data: {} },
  { id: "flux", type: "fluxCard", position: { x: 720, y: 580 }, data: {} },
  { id: "video", type: "videoCard", position: { x: 1000, y: 330 }, data: {} },
];

const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "3d",
    target: "stable",
    targetHandle: "left-top",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
  {
    id: "e2",
    source: "color",
    target: "stable",
    targetHandle: "left-bottom",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
  {
    id: "e3",
    source: "stable",
    sourceHandle: "right-top",
    target: "text",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
  {
    id: "e4",
    source: "stable",
    sourceHandle: "right-bottom",
    target: "flux",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
  {
    id: "e5",
    source: "text",
    sourceHandle: "right",
    target: "video",
    targetHandle: "left-top",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
  {
    id: "e6",
    source: "flux",
    target: "video",
    targetHandle: "left-bottom",
    type: "default",
    style: { stroke: "#bbb", strokeWidth: 1.5 },
    animated: false,
  },
];

function HeroFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  // Custom handler to clamp node positions within bounds
  const handleNodesChange = useCallback(
    (changes: any) => {
      const clampedChanges = changes.map((change: any) => {
        if (change.type === "position" && change.position) {
          return {
            ...change,
            position: {
              x: Math.max(0, Math.min(1300, change.position.x)),
              y: Math.max(0, Math.min(700, change.position.y)),
            },
          };
        }
        return change;
      });
      onNodesChange(clampedChanges);
    },
    [onNodesChange]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
      defaultEdgeOptions={{
        type: "default",
        style: { stroke: "#bbb", strokeWidth: 1.5 },
      }}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
      minZoom={1}
      maxZoom={1}
      autoPanOnNodeDrag={false}
    />
  );
}

// AI Model names for the sticky scroll section
const aiModels = [
  { name: "GPT img 1", highlighted: true },
  { name: "Wan", highlighted: false },
  { name: "SD 3.5", highlighted: true },
  { name: "Runway Gen-4", highlighted: true },
  { name: "Imagen 3", highlighted: true },
  { name: "Veo 3", highlighted: false },
  { name: "Recraft V3", highlighted: false },
  { name: "Kling", highlighted: false },
  { name: "Flux Pro 1.1 Ultra", highlighted: false },
  { name: "Minimax video", highlighted: false },
  { name: "Ideogram V3", highlighted: false },
  { name: "Luma ray 2", highlighted: false },
  { name: "Minimax image 01", highlighted: false },
  { name: "Bria", highlighted: false },
];

// Background images for the sticky section
const bgImages = [
  "/background/6825887e82ac8a8bb8139ebd_GPT img 1.avif",
  "/background/6825887d618a9071dd147d5f_SD 3.5.avif",
  "/background/6825887d65bf65cc5194ac05_Imagen 3.avif",
  "/background/6825887eda73c12eaa4c3ed8_Recraft V3.avif",
  "/background/6825887d8a7b4e937a86ea6a_Flux Pro 1.1 Ultra.avif",
  "/background/68258880f266d11a0748ab63_Minimax image 01.avif",
  "/background/6825887d9b7eb0abc91263b6_Ideogram V2.avif",
  "/background/6825887d59ff2f86b8fba523_Bria.avif",
];

function StickyModelsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how far we've scrolled through the section
      // Progress is 0 when section top hits viewport top
      // Progress is 1 when we've scrolled to the end of the section
      const scrollableAmount = sectionHeight - viewportHeight;

      if (scrollableAmount <= 0) {
        setScrollProgress(0);
        return;
      }

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableAmount));

      setScrollProgress(progress);

      // Change background based on progress
      const bgIndex = Math.min(
        bgImages.length - 1,
        Math.floor(progress * bgImages.length)
      );
      setCurrentBgIndex(bgIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate which model should be highlighted based on scroll
  const highlightedModelIndex = Math.min(
    aiModels.length - 1,
    Math.floor(scrollProgress * aiModels.length)
  );

  // Calculate transform for the models list - scroll from bottom to top
  // Each model is roughly 90px tall with the new line-height
  const itemHeight = 90;
  const totalListHeight = aiModels.length * itemHeight;
  const modelListOffset = scrollProgress * totalListHeight;

  return (
    <section
      ref={sectionRef}
      className="relative z-20 bg-black"
      style={{ height: '400vh' }}
    >
      {/* Sticky container - fills viewport and stays pinned */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background images with crossfade */}
        {bgImages.map((bg, index) => (
          <div
            key={bg}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              opacity: index === currentBgIndex ? 1 : 0,
            }}
          >
            <Image
              src={bg}
              alt="AI Generated"
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative h-full flex items-start pt-32 px-8 md:px-16 lg:px-24 gap-20">
          {/* Left side - Fixed text */}
          <div className="w-2/5">
            <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white leading-[1.1] mb-6">
              Use all AI<br />
              models,<br />
              together at<br />
              last
            </h2>
            <p className="text-white/70 text-sm md:text-base max-w-md leading-relaxed">
              AI models and professional editing tools in one node-based
              platform. Turn creative vision into scalable workflows without
              compromising quality.
            </p>
          </div>

          {/* Right side - Scrolling model names */}
          <div className="w-3/5 overflow-hidden">
            <div
              className="transition-transform duration-200 ease-out"
              style={{
                transform: `translateY(-${modelListOffset}px)`,
              }}
            >
              {aiModels.map((model, index) => (
                <div
                  key={model.name}
                  className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.2] transition-all duration-300 ${index === highlightedModelIndex
                    ? "text-[#e2ff66]"
                    : "text-white"
                    }`}
                >
                  {model.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const bp = Math.max(10, 20 - scrollY / 40);
  const bf = Math.max(12, 16 - scrollY / 60);

  return (
    <div className="min-h-screen bg-[#e8eaed] text-black">
      {/* Banner */}
      <div className="bg-[#1a1a1a] py-2 px-4 text-center text-sm flex items-center justify-center gap-2">
        <span className="text-white/80">
          🚀 Nodefy — The AI Workflow Platform
        </span>
      </div>

      {/* Nav - No border */}
      <nav className="sticky top-0 z-[500] bg-[#e8eaed]/90 backdrop-blur-md">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-black font-semibold text-sm tracking-wider uppercase">
              Nodefy
            </span>
            <div className="border-l border-[#bbb] pl-3 ml-1">
              <span className="text-[#666] text-xs uppercase tracking-wider">
                AI Workflows
              </span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#"
              className="text-[#333] text-sm font-medium uppercase tracking-wide"
            >
              Collective
            </Link>
            <Link
              href="#"
              className="text-[#333] text-sm font-medium uppercase tracking-wide"
            >
              Enterprise
            </Link>
            <Link
              href="#"
              className="text-[#333] text-sm font-medium uppercase tracking-wide"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="text-[#333] text-sm font-medium uppercase tracking-wide"
            >
              Sign In
            </Link>
          </div>
          <Link
            href="/login"
            className="bg-[#e2ff66] text-black font-semibold rounded-lg px-6 py-3 text-base hover:bg-[#d4f055] transition-colors"
          >
            Start Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative w-full"
        style={{
          minHeight: "900px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "15px 15px",
        }}
      >
        {/* Headline - Centered with spacing */}
        <div className="w-full px-10 pt-10 pb-8 relative z-[5] pointer-events-none text-center">
          <h1 className="text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] leading-[0.92] tracking-tight mb-6 flex items-center justify-center gap-8 md:gap-16">
            <span className="font-serif italic">Nodefy</span>
            <span>AI Workflows</span>
          </h1>
          <p className="text-sm md:text-base text-[#222] leading-snug max-w-xl mx-auto">
            Turn your creative vision into scalable workflows.
            <br />
            Access all AI models and professional editing tools
            <br />
            in one node based platform.
          </p>
        </div>

        {/* React Flow Canvas */}
        <div
          className="absolute left-0 right-0 top-0 bottom-0 overflow-visible"
          style={{ zIndex: 50 }}
        >
          <ReactFlowProvider>
            <HeroFlow />
          </ReactFlowProvider>
        </div>
      </section>

      {/* Sticky AI Models Section */}
      <StickyModelsSection />

      {/* Explore Our Workflows Section */}
      <section className="bg-[#252525] text-white py-20 px-12 overflow-hidden">
        <h2 className="text-6xl md:text-7xl lg:text-8xl font-normal leading-none mb-8">
          Explore Our
          <br />
          Workflows
        </h2>
        <p className="text-white text-lg max-w-lg mb-12 leading-relaxed">
          From multi-layer compositing to matte manipulation, Nodefy keeps up
          with your creativity with all the editing tools you recognize and rely
          on.
        </p>

        {/* Infinite Scroll Cards - CSS Animation */}
        <div className="relative -mx-12">
          <div
            className="flex gap-6 animate-marquee cursor-grab active:cursor-grabbing"
            style={{ width: "max-content" }}
            onMouseDown={(e) => {
              const slider = e.currentTarget;
              slider.style.animationPlayState = "paused";
              const startX = e.pageX - slider.offsetLeft;
              const scrollLeft = slider.parentElement?.scrollLeft || 0;

              const onMouseMove = (moveEvent: MouseEvent) => {
                const x = moveEvent.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                if (slider.parentElement) {
                  slider.parentElement.scrollLeft = scrollLeft - walk;
                }
              };

              const onMouseUp = () => {
                slider.style.animationPlayState = "running";
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
              };

              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          >
            {/* Original Cards */}
            <div className="min-w-[420px] flex-shrink-0 pl-12">
              <h3 className="text-xl font-normal mb-4">Relight – Product</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/6825b0ac04c55a803826a6e5_Relight - Product.avif"
                  alt="Relight Product"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">
                <span className="text-[#e2ff66]">Wan Lora – Rotate</span>
              </h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/6825b0acc901ee5c718efc90_Wan Lora - Rotate.avif"
                  alt="Wan Lora Rotate"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Workflow 01</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc15e_Workflow 01.avif"
                  alt="Workflow 01"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Workflow 02</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc16a_Workflow 02.avif"
                  alt="Workflow 02"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Workflow 03</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc164_Workflow 03.avif"
                  alt="Workflow 03"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            {/* Duplicate Cards for seamless loop */}
            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Relight – Product</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/6825b0ac04c55a803826a6e5_Relight - Product.avif"
                  alt="Relight Product"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">
                <span className="text-[#e2ff66]">Wan Lora – Rotate</span>
              </h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/6825b0acc901ee5c718efc90_Wan Lora - Rotate.avif"
                  alt="Wan Lora Rotate"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Workflow 01</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc15e_Workflow 01.avif"
                  alt="Workflow 01"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0">
              <h3 className="text-xl font-normal mb-4">Workflow 02</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc16a_Workflow 02.avif"
                  alt="Workflow 02"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[420px] flex-shrink-0 pr-12">
              <h3 className="text-xl font-normal mb-4">Workflow 03</h3>
              <div className="relative h-[250px] rounded-xl overflow-hidden">
                <Image
                  src="/infinite-scroll/681f925d9ecbfaf69c5dc164_Workflow 03.avif"
                  alt="Workflow 03"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-[#e2ff66] text-black px-4 py-2 rounded-lg font-semibold text-sm">
                    Try
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* CTA + Footer Section - Full width section, content has right padding, button at viewport edge */}
      <section className="relative bg-[#252525] pb-[10px]">
        {/* Background shape with rounded corner */}
        <div
          className="absolute inset-y-0 left-0 rounded-tr-[40px] bg-[#b5bab0]"
          style={{ right: "15%" }}
        ></div>

        {/* Content container */}
        <div
          className="relative z-10 text-white"
          style={{ marginRight: "20%" }}
        >
          {/* CTA Header - Left aligned like footer content */}
          <div className="pt-16 pb-12 px-12">
            <div className="flex items-center gap-6">
              <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-normal leading-[1.05]">
                <span>Artificial</span>
                <br />
                <span>Intelligence</span>
              </h2>
              <span className="text-5xl md:text-9xl font-extralight">+</span>
              <h2 className="text-4xl md:text-6xl lg:text-[5rem] font-normal leading-[1.05]">
                <span>Human</span>
                <br />
                <span>Creativity</span>
              </h2>
            </div>
          </div>

          {/* Footer Content */}
          <div className="py-10 px-12">
            {/* Top row: Logo + Description - left aligned like Weavy */}
            <div className="flex items-center gap-8 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#3a3f37] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div className="border-l border-white pl-4">
                  <span className="text-white font-semibold text-sm tracking-wide block">
                    NODEFY
                  </span>
                  <span className="text-white text-xs uppercase tracking-wider">
                    AI Workflows
                  </span>
                </div>
              </div>
              <p className="text-white text-sm max-w-md leading-relaxed hidden md:block">
                Nodefy is a new way to create. We&apos;re bridging the gap
                between AI capabilities and human creativity, to continue the
                tradition of craft in artistic expression. We call it AI
                Workflows.
              </p>
            </div>

            {/* Links row - 4 columns closer together + social icons on right */}
            <div className="flex items-start gap-12 mb-10">
              <div>
                <h4 className="text-white/70 text-[10px] uppercase tracking-wider mb-3">
                  Get Started
                </h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Request a Demo
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Enterprise
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 text-[10px] uppercase tracking-wider mb-3">
                  Company
                </h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Trust
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Privacy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 text-[10px] uppercase tracking-wider mb-3">
                  Connect
                </h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Collective
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white/70 text-[10px] uppercase tracking-wider mb-3">
                  Resources
                </h4>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="#"
                      className="text-white/80 hover:text-white text-xs uppercase tracking-wide"
                    >
                      Knowledge Center
                    </a>
                  </li>
                </ul>
              </div>
              {/* Social icons in same row */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36-.698.772-1.362 1.225-1.993a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.12-.094.246-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom: SOC 2 badge and copyright */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2    py-1 w-fit">
                <span className="text-[8px] bg-black text-white uppercase font-bold border border-black/30 rounded-full p-2">
                  AICPA
                  <br />
                  SOC
                </span>
                <div>
                  <span className="text-[11px] text-black font-medium">
                    SOC 2 Type II Certified
                  </span>
                  <p className="text-[11px] text-black/40">
                    Your data is protected with industry-standard security
                    controls.
                  </p>
                </div>
              </div>
              <span className="text-black pl-1 pt-3 text-[12px] uppercase tracking-wider">
                Nodefy © 2025. All Rights Reserved.
              </span>
            </div>
          </div>
        </div>

        {/* Decorative curved line - scrolls with footer */}
        <div className="absolute right-0 top-0 bottom-0 w-[250px] pointer-events-none z-[1]">
          <svg
            viewBox="0 0 250 700"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M 250 0 Q 50 350 250 700"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* HUGE Start Now Button - At bottom-right of footer, scrolls with page */}
        <Link
          href="/login"
          className="absolute bottom-0 right-0 bg-[#F8FF9E] text-black  rounded-tl-3xl pr-18 pl-10 py-8 text-8xl hover:bg-[#d4f055] transition-colors shadow-2xl z-[999]"
        >
          Start Now
        </Link>
      </section>
    </div>
  );
}
