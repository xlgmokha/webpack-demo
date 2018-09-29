import 'react';
import 'react-dom';
import component from './component';
import "./main.css";
import 'purecss';
import { bake } from "./shake";

bake();
document.body.appendChild(component());
