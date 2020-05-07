/*
 * Copyright (C) 2014-present Cloudflare, Inc.

 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

'use strict';

const prototypal = require('es-class');
const auto = require('autocreate');

const Resource = require('../Resource');
const method = require('../method');

/**
 * StreamVideos represents the /accout/:id/stream API endpoint.
 *
 * @class StreamVideos
 * @hideconstructor
 * @extends Resource
 */
module.exports = auto(
  prototypal({
    extends: Resource,
    path: 'accounts',
    hasBrokenPatch: true,

    includeBasic: ['browse', 'read', 'edit', 'add', 'del'],

    /**
     * ListVideos retrieves all of a account's videos.
     *
     * @function listVideos
     * @memberof StreamVideos
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @returns {Promise<Object>} The response object
     */
    listVideos: method({
      method: 'GET',
      path: ':accountId/stream',
    }),

    /**
     * VideoDetails retrieves details of a account's single video.
     *
     * @function videoDetails
     * @memberof StreamVideos
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The video ID
     * @returns {Promise<Object>} The response object
     */
    videoDetails: method({
      method: 'GET',
      path: ':accountId/stream/:id',
    }),

    /**
     * UploadVideoFromUrl uploads a video from specific URL
     *
     * @function uploadVideoFromUrl
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} url - URL to the video
     * @returns {Promise<Object>} The response object
     */
    uploadVideoFromUrl: method({
      method: 'POST',
      path: ':accountId/stream/copy',
    }),

    /**
     * DeleteVideo deletes a account's single video.
     *
     * @function deleteVideo
     * @memberof StreamVideos
     * @instance
     * @async
     * @param {string} accountId - The account ID
     * @param {string} id - The video ID
     * @returns {Promise<Object>} The response object
     */
    deleteVideo: method({
      method: 'DELETE',
      path: ':accountId/stream/:id',
    }),
  })
);
