import { useEffect, useRef, useCallback } from "react";

import * as THREE from "three";

import "./index.scss";

const Page = () => {
  const Body = useRef();
  /*
   Scene = new THREE.Scene()
   避免重复生成THREE.Scene()
  */
  const Scene = useRef(new THREE.Scene()).current;
  const Camera = useRef(new THREE.PerspectiveCamera()).current;
  const Render = useRef(new THREE.WebGLRenderer({ antialias: true })).current;
  const Meshs = useRef([]).current;
  // record id of requestAnimationFrame
  const id = useRef(null);

  const createRect = useCallback(() => {
    const rect = new THREE.BoxBufferGeometry(2, 2, 2);
    const meshBasicMater = new THREE.MeshBasicMaterial({ color: "red" });
    const mesh = new THREE.Mesh(rect, meshBasicMater);
    mesh.position.set(0, 0, 0);
    Scene.add(mesh);
    Meshs.push(mesh);
  }, []);

  const init = useCallback(() => {
    Render.setSize(Body.current.offsetWidth, Body.current.offsetHeight);
    // 设置相机参数
    Camera.aspect = Body.current.offsetWidth / Body.current.offsetHeight;
    Camera.fov = 45;
    Camera.near = 1;
    Camera.far = 1000;
    Camera.position.set(0, 10, 20);
    Camera.lookAt(0, 0, 0);
    Camera.updateProjectionMatrix();
  }, [Render, Body]);

  const renderScene = useCallback(() => {
    Render.render(Scene, Camera);
    Meshs.forEach((item) => {
      item.rotation.x += (0.5 / 180) * Math.PI;
      item.rotation.y += (0.5 / 180) * Math.PI;
    });
    id.current = window.requestAnimationFrame(() => renderScene());
  }, [Render, Meshs]);

  useEffect(() => {
    Body.current.append(Render.domElement);
    init();
    createRect();
    renderScene();
    return () => {
      cancelAnimationFrame(id.current);
      Meshs.forEach((item) => {
        Scene.remove(item);
        item.geometry.dispose();
        item.material.dispose();
      });

      Render.dispose();
      Scene.dispose();
    };
  }, []);

  return <div className="page" ref={Body}></div>;
};

export default Page;
