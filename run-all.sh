#!/bin/bash

(cd frontend && npm run dev) &

(cd node_auth && deno run dev) &
(cd node_courselist && deno run dev) &
(cd node_course_enroll && deno run dev) &
(cd node_grade_view && deno run dev) &
(cd node_grade_upload && deno run dev) &

wait
