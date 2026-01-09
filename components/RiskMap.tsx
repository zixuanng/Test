
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RiskMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(json => {
        const featuresWithRisk = json.features.map((f: any) => ({
          ...f,
          properties: {
            ...f.properties,
            risk: Math.random()
          }
        }));
        setGeoData({ ...json, features: featuresWithRisk });
      })
      .catch(err => console.error("Error loading map data:", err));
  }, []);

  useEffect(() => {
    if (!svgRef.current || !geoData) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('cursor', 'move');

    svg.selectAll("*").remove();

    // 1. Static Ocean Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#020617');

    // 2. Zoomable Content Container
    const contentGroup = svg.append('g').attr('class', 'content-group');

    // Map Projection
    const projection = d3.geoMercator()
      .scale(width / 6.8)
      .translate([width / 2, height / 1.6]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Satellite Color Scale: Deep Space/Dark Earth theme
    const getCountryColor = (risk: number) => {
      return d3.scaleLinear<string>()
        .domain([0, 0.5, 1])
        .range(['#0f172a', '#1e293b', '#991b1b'])(risk);
    };

    // Graticule (Lat/Long lines) - Inside zoomable group
    const graticule = d3.geoGraticule();
    contentGroup.append('path')
      .datum(graticule())
      .attr('class', 'graticule')
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.15);

    // World Map - Inside zoomable group
    const mapGroup = contentGroup.append('g').attr('class', 'world-map');
    
    mapGroup.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => getCountryColor(d.properties.risk))
      .attr('stroke', '#334155')
      .attr('stroke-width', 0.3)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .attr('opacity', 1);

    // Zoom Behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Zoom limits
      .translateExtent([[0, 0], [width, height]]) // Pan limits
      .on('zoom', (event) => {
        contentGroup.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom as any);

    // 3. Static HUD Overlays (Grid & Scanline) - Pointer events none to allow zoom through
    const gridGroup = svg.append('g')
      .attr('class', 'grid')
      .style('pointer-events', 'none');
      
    const gridSize = 20;
    const gridOpacity = 0.15;

    gridGroup.append('g')
      .attr('stroke', '#475569')
      .attr('stroke-width', 0.5)
      .attr('opacity', gridOpacity)
      .selectAll('line.horizontal')
      .data(d3.range(0, height, gridSize))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => d)
      .attr('y2', d => d);

    gridGroup.append('g')
      .attr('stroke', '#475569')
      .attr('stroke-width', 0.5)
      .attr('opacity', gridOpacity)
      .selectAll('line.vertical')
      .data(d3.range(0, width, gridSize))
      .enter()
      .append('line')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('x1', d => d)
      .attr('x2', d => d);

    // Satellite Scan Line Animation
    const scanLine = svg.append('line')
      .attr('stroke', '#38bdf8')
      .attr('stroke-width', 1)
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('opacity', 0.3)
      .style('pointer-events', 'none');

    function animateScan() {
      scanLine
        .attr('y1', 0)
        .attr('y2', 0)
        .transition()
        .duration(8000)
        .ease(d3.easeLinear)
        .attr('y1', height)
        .attr('y2', height)
        .on('end', animateScan);
    }
    animateScan();

  }, [geoData]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomBehaviorRef.current.scaleBy, 0.6); // 1 / 1.5 approx
    }
  };

  const handleReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative group">
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs pointer-events-none select-none">
         <div className="font-bold text-slate-400 mb-2 uppercase tracking-tighter">
           SATELLITE RISK HEATMAP
         </div>
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-700"></div> Low</div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-700"></div> Stable</div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Alert</div>
           <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-600"></div> Danger</div>
         </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg shadow-lg transition-colors"
          title="Zoom In"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg shadow-lg transition-colors"
          title="Zoom Out"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button 
          onClick={handleReset}
          className="w-8 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-lg shadow-lg transition-colors"
          title="Reset View"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {!geoData ? (
        <div className="w-full h-[400px] flex items-center justify-center bg-slate-950/50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Fetching Orbital Data...</span>
          </div>
        </div>
      ) : (
        <svg ref={svgRef} className="w-full h-[400px] transition-all duration-500"></svg>
      )}
      
      <div className="p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 bg-slate-900/50 relative z-10">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse bg-sky-500"></div>
            Orbital Spectrum Active
         </div>
         <div className="font-mono opacity-60">GEO_CHOROPLETH_v4</div>
      </div>
    </div>
  );
};

export default RiskMap;
